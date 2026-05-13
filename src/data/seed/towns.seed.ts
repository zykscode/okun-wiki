/**
 * Seed: Migrates static towns.ts data into PostgreSQL via Prisma.
 *
 * Usage:
 *   npx tsx src/data/seed/towns.seed.ts
 *
 * Requirements:
 *   - DATABASE_URL must be set in .env
 *   - Run `prisma migrate dev` first
 *   - Set ADMIN_SEED_EMAIL to the email of the admin user to create/find
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load .env from project root (wherever tsx is invoked from)
config({ path: resolve(process.cwd(), ".env") });

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { towns } from "../towns";

// Enable WebSocket for Neon in Node.js (required for transactions)
neonConfig.webSocketConstructor = ws;

if (!process.env.DIRECT_DATABASE_URL) {
  console.error("❌ DIRECT_DATABASE_URL is not set. Check your .env file.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Okunpedia seed...");

  // ── 1. Upsert State ──────────────────────────────────────────────────────
  const kogiState = await prisma.state.upsert({
    where: { code: "KG" },
    update: {},
    create: { name: "Kogi", code: "KG" },
  });
  console.log(`✅ State: ${kogiState.name}`);

  // ── 2. Collect unique LGAs from static data and upsert them ─────────────
  const uniqueLGANames = [...new Set(towns.map((t) => t.lga))];
  const lgaMap: Record<string, string> = {}; // lgaName → lgaId

  for (const lgaName of uniqueLGANames) {
    const lga = await prisma.lGA.upsert({
      where: { name_stateId: { name: lgaName, stateId: kogiState.id } },
      update: {},
      create: { name: lgaName, stateId: kogiState.id },
    });
    lgaMap[lgaName] = lga.id;
    console.log(`  ↳ LGA: ${lga.name}`);
  }

  // ── 3. Seed admin user (if env is set) ───────────────────────────────────
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@okunpedia.com";
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Okunpedia Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Admin user: ${adminUser.email}`);

  // ── 4. Seed towns ─────────────────────────────────────────────────────────
  for (const town of towns) {
    // Parse lat/lng from the legacy "lat,lng" string
    let lat: number | undefined;
    let lng: number | undefined;
    if (town.coordinates) {
      const [latStr, lngStr] = town.coordinates.split(",");
      lat = parseFloat(latStr);
      lng = parseFloat(lngStr);
    }

    const lgaId = lgaMap[town.lga];
    if (!lgaId) {
      console.warn(`⚠️  LGA not found for town: ${town.name}`);
      continue;
    }

    const createdTown = await prisma.town.upsert({
      where: { slug: town.slug },
      update: {
        name: town.name,
        tagline: town.tagline,
        overview: town.overview,
        metaDescription: town.metaDescription,
        lat,
        lng,
        population: town.population,
        founded: town.founded,
        featured: town.featured,
        lgaId,
        published: true,
      },
      create: {
        name: town.name,
        slug: town.slug,
        tagline: town.tagline,
        overview: town.overview,
        metaDescription: town.metaDescription,
        lat,
        lng,
        population: town.population,
        founded: town.founded,
        featured: town.featured,
        published: true,
        lgaId,
        createdById: adminUser.id,
      },
    });
    console.log(`✅ Town: ${createdTown.name}`);

    // ── Seed TownPages ──────────────────────────────────────────────────────
    for (const page of town.pages) {
      const createdPage = await prisma.townPage.upsert({
        where: { townId_slug: { townId: createdTown.id, slug: page.slug } },
        update: { content: page.content, title: page.title, order: page.order },
        create: {
          townId: createdTown.id,
          type: page.type,
          title: page.title,
          slug: page.slug,
          content: page.content,
          order: page.order,
          published: true,
        },
      });

      // Create initial version if none exist
      const versionCount = await prisma.pageVersion.count({
        where: { pageId: createdPage.id },
      });
      if (versionCount === 0) {
        await prisma.pageVersion.create({
          data: {
            pageId: createdPage.id,
            content: createdPage.content,
            editSummary: "Seeded from static data",
            version: 1,
            createdById: adminUser.id,
          },
        });
      }
    }

    // ── Seed Festivals ─────────────────────────────────────────────────────
    for (const festival of town.festivals) {
      await prisma.festival.upsert({
        where: { id: festival.id },
        update: {
          name: festival.name,
          description: festival.description,
          period: festival.period,
          significance: festival.significance,
        },
        create: {
          id: festival.id,
          townId: createdTown.id,
          name: festival.name,
          description: festival.description,
          period: festival.period,
          significance: festival.significance,
        },
      });
    }

    // ── Seed Prominent People ─────────────────────────────────────────────
    for (const person of town.people) {
      await prisma.prominentPerson.upsert({
        where: { id: person.id },
        update: {
          name: person.name,
          title: person.title,
          role: person.role,
          biography: person.biography,
          birthYear: person.birthYear ?? null,
          deathYear: person.deathYear ?? null,
          isAlive: person.isAlive,
        },
        create: {
          id: person.id,
          townId: createdTown.id,
          name: person.name,
          title: person.title,
          role: person.role,
          biography: person.biography,
          birthYear: person.birthYear ?? null,
          deathYear: person.deathYear ?? null,
          isAlive: person.isAlive,
        },
      });
    }
  }

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
