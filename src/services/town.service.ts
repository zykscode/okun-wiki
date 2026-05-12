import { towns, Town } from "@/data/towns";

/**
 * Town Service - Data Access Layer
 * Currently fetches from static local data, easily swappable to a CMS later.
 */
export const TownService = {
  /**
   * Fetch all published towns
   */
  async getAllTowns(): Promise<Town[]> {
    // Simulating async behavior for future CMS swap
    return Promise.resolve(towns);
  },

  /**
   * Fetch featured towns
   */
  async getFeaturedTowns(): Promise<Town[]> {
    return Promise.resolve(towns.filter((t) => t.featured));
  },

  /**
   * Fetch a single town by its slug
   */
  async getTownBySlug(slug: string): Promise<Town | null> {
    const town = towns.find((t) => t.slug === slug);
    return Promise.resolve(town || null);
  },
};
