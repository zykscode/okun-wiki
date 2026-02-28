import { PrismaClient, UserRole, PageType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("password123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@okunwiki.com" },
    update: {},
    create: {
      email: "admin@okunwiki.com",
      name: "Wiki Admin",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("👤 Created admin user:", admin.email);

  // Kabba
  const kabba = await prisma.town.upsert({
    where: { slug: "kabba" },
    update: {},
    create: {
      name: "Kabba",
      slug: "kabba",
      tagline: "The Heart of Ọ̀kun Land",
      state: "Kogi",
      lga: "Kabba/Bunu",
      coordinates: "7.8283,6.0733",
      population: 106925,
      founded: "Pre-15th century",
      overview: `Kabba is one of the most prominent towns in Ọ̀kun land and serves as the headquarters of Kabba/Bunu Local Government Area in Kogi State, Nigeria. The town is strategically located at the confluence of cultures, sitting at the crossroads between the Yoruba-speaking southwest and the diverse ethnic groups of central Nigeria.

Kabba has a rich historical significance, having served as a major administrative center during the colonial era. The town was the headquarters of Kabba Province, which at various times encompassed a vast territory. This administrative importance brought infrastructure, education, and commerce to the town early on.

The people of Kabba are known for their warmth, hospitality, and strong cultural traditions. The town celebrates several festivals throughout the year, including the famous Ogun Festival, which honors the deity of iron and warfare. Agriculture remains a backbone of the local economy, with crops such as yam, cassava, rice, and various fruits thriving in the fertile soil.

Kabba is also notable for its educational institutions, including some of the oldest secondary schools in Kogi State. The town has produced numerous professionals, academics, and leaders who have contributed significantly to national development.`,
      metaDescription: "Discover Kabba — the heart of Ọ̀kun land in Kogi State, Nigeria. Learn about its rich history, culture, and people.",
      published: true,
      featured: true,
      createdById: admin.id,
    },
  });

  // Kabba pages
  await prisma.townPage.upsert({
    where: { townId_slug: { townId: kabba.id, slug: "history" } },
    update: {},
    create: {
      townId: kabba.id,
      type: PageType.HISTORY,
      title: "History of Kabba",
      slug: "history",
      order: 1,
      content: `Kabba's history stretches back several centuries, with oral traditions tracing the founding of the town to migrations from Ile-Ife, the ancestral home of the Yoruba people. The early settlers established a community centered around farming and trade, taking advantage of the town's strategic location.

During the 19th century, Kabba experienced significant upheaval due to the Nupe raids and the broader political changes sweeping across what would become Nigeria. The town's people demonstrated remarkable resilience, rebuilding and strengthening their community after each challenge.

The arrival of the British colonial administration in the early 20th century transformed Kabba into a major administrative center. The establishment of Kabba Province brought new infrastructure, including roads, schools, and government buildings. The town became a melting pot of cultures as people from various parts of the province converged for administrative and commercial purposes.

After Nigerian independence in 1960, Kabba continued to play an important role in regional politics and administration. The creation of Kogi State in 1991 brought new opportunities and challenges, with the Ọ̀kun people working to maintain their cultural identity within the broader state framework.`,
    },
  });

  await prisma.townPage.upsert({
    where: { townId_slug: { townId: kabba.id, slug: "culture" } },
    update: {},
    create: {
      townId: kabba.id,
      type: PageType.CULTURE,
      title: "Culture & Traditions",
      slug: "culture",
      order: 2,
      content: `The culture of Kabba is deeply rooted in Yoruba traditions, enriched by centuries of interaction with neighboring ethnic groups. The people maintain a strong connection to their ancestral customs while adapting to modern life.

Language is a central element of Kabba's cultural identity. The Ọ̀kun dialect spoken in Kabba is distinct from standard Yoruba, featuring unique vocabulary, intonations, and expressions that reflect the community's history and geographical location.

Traditional institutions remain important in Kabba. The Obaro of Kabba is the paramount traditional ruler, whose authority and counsel are respected by the community. The chieftaincy system plays a vital role in maintaining social order, settling disputes, and preserving cultural practices.

Music and dance are integral to Kabba's cultural expression. Traditional drumming, particularly the use of the dundun (talking drum), accompanies most cultural events. Various dance forms, each with specific cultural significance, are performed during festivals and celebrations.

Cuisine in Kabba reflects the agricultural bounty of the region. Pounded yam with various soups, amala, and local delicacies made from indigenous ingredients are staples. The preparation and sharing of food holds deep cultural significance, reinforcing community bonds.`,
    },
  });

  // Kabba festivals
  await prisma.festival.create({
    data: {
      townId: kabba.id,
      name: "Ogun Festival",
      description: "The annual Ogun Festival is one of the most celebrated cultural events in Kabba. It honors Ogun, the Yoruba deity of iron, war, and labor. The festival features traditional dances, masquerade displays, and communal feasting.",
      period: "Annual — August/September",
      significance: "The festival reinforces cultural identity, honors ancestral traditions, and serves as a homecoming event for indigenes living outside Kabba.",
      images: "[]",
    },
  });

  // Kabba prominent person
  await prisma.prominentPerson.create({
    data: {
      townId: kabba.id,
      name: "Chief Solomon Dele Olu",
      title: "Chief",
      role: "Community Leader",
      biography: "A distinguished community leader and advocate for the development of Kabba and the broader Ọ̀kun area. Known for his tireless efforts in promoting education and infrastructure development in the region.",
      isAlive: true,
    },
  });

  console.log("🏘️ Created Kabba");

  // Ijumu
  const isanlu = await prisma.town.upsert({
    where: { slug: "isanlu" },
    update: {},
    create: {
      name: "Isanlu",
      slug: "isanlu",
      tagline: "Gateway to Ijumu",
      state: "Kogi",
      lga: "Ijumu",
      coordinates: "7.9847,5.8403",
      population: 45000,
      founded: "Pre-16th century",
      overview: `Isanlu is the administrative headquarters of Ijumu Local Government Area in Kogi State. It is one of the major towns in Ọ̀kun land, known for its vibrant culture, educational achievements, and strategic importance in the region.

The town sits in a picturesque landscape of rolling hills and lush vegetation, surrounded by fertile farmlands that support both subsistence and commercial agriculture. Isanlu's location along major road networks has historically made it a center of trade and commerce in the region.

Isanlu is renowned for its contribution to education in Kogi State and beyond. The town hosts several notable educational institutions and has produced a remarkable number of professionals, academics, and public servants relative to its size.

The cultural life of Isanlu is rich and vibrant, with various festivals and celebrations that mark the agricultural calendar and honor ancestral traditions. The town's people are known for their hospitality, strong community bonds, and commitment to preserving their Ọ̀kun heritage.`,
      metaDescription: "Explore Isanlu — gateway to Ijumu in Kogi State. Discover its history, education legacy, and cultural heritage.",
      published: true,
      featured: true,
      createdById: admin.id,
    },
  });

  await prisma.townPage.upsert({
    where: { townId_slug: { townId: isanlu.id, slug: "history" } },
    update: {},
    create: {
      townId: isanlu.id,
      type: PageType.HISTORY,
      title: "History of Isanlu",
      slug: "history",
      order: 1,
      content: `Isanlu's origins are deeply connected to the broader Yoruba migration narratives. The town's founders are believed to have migrated from Ile-Ife and established a settlement that would grow into one of the most important towns in Ijumu land.

Throughout its history, Isanlu served as a center of resistance during the turbulent 19th century, when various groups vied for control of the region. The people of Isanlu demonstrated remarkable unity and resilience in the face of external threats.

The colonial period brought significant changes to Isanlu, including the introduction of Western education and Christianity alongside existing traditional beliefs. The town became an important node in the colonial administrative network, benefiting from infrastructure development.

In the post-independence era, Isanlu has continued to evolve, balancing modernization with cultural preservation. The creation of Ijumu Local Government Area with Isanlu as headquarters further cemented the town's importance in regional administration.`,
    },
  });

  console.log("🏘️ Created Isanlu");

  // Mopa
  const mopa = await prisma.town.upsert({
    where: { slug: "mopa" },
    update: {},
    create: {
      name: "Mopa",
      slug: "mopa",
      tagline: "Land of Unity",
      state: "Kogi",
      lga: "Mopa-Muro",
      coordinates: "8.1500,5.9667",
      population: 35000,
      founded: "Pre-17th century",
      overview: `Mopa is the headquarters of Mopa-Muro Local Government Area in Kogi State. Nestled in the northern reaches of Ọ̀kun land, Mopa is a town steeped in tradition and known for its strong community spirit.

The town is surrounded by expansive farmlands and natural vegetation, reflecting the agricultural heritage that has sustained the community for centuries. Yam farming, in particular, holds a special place in Mopa's economy and culture, with the annual yam festival being one of the highlights of the town's calendar.

Mopa has played a significant role in the political and cultural development of the Ọ̀kun people. The town's leaders have been at the forefront of advocacy for the development of the region and the preservation of Ọ̀kun cultural identity.

Education and youth development are priorities in Mopa, with the community investing in schools and programs that prepare the next generation for leadership while grounding them in their cultural heritage.`,
      metaDescription: "Discover Mopa — a town of unity and tradition in Kogi State. Learn about its culture, festivals, and community spirit.",
      published: true,
      featured: true,
      createdById: admin.id,
    },
  });

  await prisma.festival.create({
    data: {
      townId: mopa.id,
      name: "New Yam Festival",
      description: "The New Yam Festival is a major cultural celebration in Mopa, marking the beginning of the harvest season. The festival features thanksgiving rituals, feasting on freshly harvested yams, traditional dances, and community gatherings.",
      period: "Annual — September/October",
      significance: "Celebrates the agricultural cycle, gives thanks for a successful harvest, and reinforces community bonds. It is also an occasion for homecoming and family reunions.",
      images: "[]",
    },
  });

  console.log("🏘️ Created Mopa");

  // Egbe
  const egbe = await prisma.town.upsert({
    where: { slug: "egbe" },
    update: {},
    create: {
      name: "Egbe",
      slug: "egbe",
      tagline: "City of Harmony",
      state: "Kogi",
      lga: "Yagba West",
      coordinates: "8.2167,5.7500",
      population: 52000,
      founded: "Pre-16th century",
      overview: `Egbe is a prominent town in Yagba West Local Government Area of Kogi State. Known as the "City of Harmony," Egbe holds a special place in the history of Christianity in Nigeria and the broader Ọ̀kun cultural landscape.

The town gained historical significance through the establishment of one of the earliest missionary stations in the region. This early exposure to Western education gave Egbe a head start in producing educated professionals who went on to serve Nigeria in various capacities.

Egbe sits in a scenic landscape with beautiful hills, streams, and lush vegetation. The town's natural beauty, combined with its historical monuments and cultural sites, makes it a potential destination for cultural tourism in Kogi State.

The people of Egbe are known for their warmth, intellectual curiosity, and strong sense of community. The town maintains vibrant traditional institutions alongside modern civic structures, creating a unique blend of old and new.`,
      metaDescription: "Explore Egbe — the City of Harmony in Kogi State. Discover its missionary history, natural beauty, and cultural heritage.",
      published: true,
      featured: true,
      createdById: admin.id,
    },
  });

  await prisma.townPage.upsert({
    where: { townId_slug: { townId: egbe.id, slug: "history" } },
    update: {},
    create: {
      townId: egbe.id,
      type: PageType.HISTORY,
      title: "History of Egbe",
      slug: "history",
      order: 1,
      content: `Egbe's history is intertwined with some of the most significant developments in the region's past. The town's origins trace back to ancient Yoruba migrations, with the founders establishing a settlement that would grow into one of the most important towns in Yagba land.

One of the most transformative events in Egbe's history was the arrival of Christian missionaries in the mid-20th century. The establishment of a missionary hospital and school complex put Egbe on the map as a center of education and healthcare. These institutions trained generations of professionals who contributed to national development.

The missionary connection also brought international attention to Egbe, with visitors from around the world coming to the town. This cosmopolitan influence enriched Egbe's culture while the people maintained their traditional values and practices.

In the contemporary era, Egbe continues to honor its heritage while embracing progress. The town's annual cultural festivals draw thousands of visitors, and efforts are underway to preserve historical sites and artifacts for future generations.`,
    },
  });

  await prisma.prominentPerson.create({
    data: {
      townId: egbe.id,
      name: "Rev. S. A. Adebiyi",
      title: "Rev.",
      role: "Religious Leader & Educator",
      biography: "One of the pioneering Nigerian clergymen who worked alongside the missionaries in Egbe. His contributions to education and community development laid the foundation for Egbe's reputation as a center of learning.",
      isAlive: false,
      birthYear: 1910,
      deathYear: 1985,
    },
  });

  console.log("🏘️ Created Egbe");

  console.log("\n✅ Seeding complete!");
  console.log("📧 Admin login: admin@okunwiki.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
