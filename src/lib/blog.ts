import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "src/content/blog");

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

export async function getBlogPosts() {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx?$/, ""),
        ...data,
        content,
      } as BlogPost;
    })
    .filter((post) => post.published);

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string) {
  const filePath = path.join(blogDir, `${slug}.mdx`);
  const mdPath = path.join(blogDir, `${slug}.md`);

  let finalPath = "";
  if (fs.existsSync(filePath)) {
    finalPath = filePath;
  } else if (fs.existsSync(mdPath)) {
    finalPath = mdPath;
  } else {
    return null;
  }

  const fileContent = fs.readFileSync(finalPath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    ...data,
    content,
  } as BlogPost;
}
