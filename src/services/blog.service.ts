import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  coverImage?: string;
  published: boolean;
  content: string;
}

export const BlogService = {
  /**
   * Fetch all blog posts
   */
  async getAllPosts(): Promise<BlogPost[]> {
    if (!fs.existsSync(contentDirectory)) return [];

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
          slug,
          content: matterResult.content,
          ...(matterResult.data as Omit<BlogPost, "slug" | "content">),
        };
      })
      .filter((post) => post.published);

    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  },

  /**
   * Fetch a single blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const fullPath = path.join(contentDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);

      return {
        slug,
        content: matterResult.content,
        ...(matterResult.data as Omit<BlogPost, "slug" | "content">),
      };
    } catch (error) {
      return null;
    }
  },
};
