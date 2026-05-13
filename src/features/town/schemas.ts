import { z } from "zod";

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

export const LGASchema = z.object({
  name: z.string().min(2, "LGA name is required"),
  stateId: z.string().cuid("Invalid state ID"),
});

export const TribeSchema = z.object({
  name: z.string().min(2, "Tribe name is required"),
  description: z.string().optional(),
});

// ─── Sub-entities ─────────────────────────────────────────────────────────────

export const TownImageSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  caption: z.string().optional(),
  credit: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const TownPageSchema = z.object({
  type: z.enum(["HISTORY", "CULTURE", "GEOGRAPHY", "ECONOMY", "CUSTOM"]),
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
  editSummary: z.string().optional(), // for PageVersion
});

export const FestivalSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  period: z.string().min(3), // e.g. "Annual — August"
  significance: z.string().min(10),
});

export const ProminentPersonSchema = z.object({
  name: z.string().min(2),
  title: z.string().optional(),
  role: z.string().min(2),
  biography: z.string().min(20),
  birthYear: z.coerce.number().int().min(1000).max(2100).optional().nullable(),
  deathYear: z.coerce.number().int().min(1000).max(2100).optional().nullable(),
  isAlive: z.boolean().default(true),
  imageUrl: z.string().url().optional().nullable(),
});

export const AmenitySchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  status: z.string().min(2),
});

export const CommunityNeedSchema = z.object({
  category: z.string().min(2),
  description: z.string().min(10),
  urgency: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

// ─── Town ─────────────────────────────────────────────────────────────────────

export const TownSchema = z.object({
  name: z.string().min(2, "Town name is required"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  tagline: z.string().max(120).optional(),
  overview: z.string().min(100, "Overview must be at least 100 characters"),
  metaDescription: z.string().max(160).optional(),
  lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  lng: z.coerce.number().min(-180).max(180).optional().nullable(),
  population: z.coerce.number().int().positive().optional().nullable(),
  founded: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  lgaId: z.string().cuid("Please select an LGA"),
  tribeId: z.string().cuid().optional().nullable(),
});

export type TownFormValues = z.infer<typeof TownSchema>;
export type TownPageFormValues = z.infer<typeof TownPageSchema>;
export type FestivalFormValues = z.infer<typeof FestivalSchema>;
export type ProminentPersonFormValues = z.infer<typeof ProminentPersonSchema>;
export type AmenityFormValues = z.infer<typeof AmenitySchema>;
export type CommunityNeedFormValues = z.infer<typeof CommunityNeedSchema>;
export type LGAFormValues = z.infer<typeof LGASchema>;
export type TribeFormValues = z.infer<typeof TribeSchema>;
