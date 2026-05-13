/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogPostSchema, type BlogPostFormValues } from "@/features/blog/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { createBlogPost, updateBlogPost } from "@/features/blog/actions";
import { useRouter } from "next/navigation";

interface BlogFormProps {
  initialData?: any;
  tags?: { id: string; name: string }[];
  towns?: { id: string; name: string }[];
}

export function BlogForm({ initialData, tags = [], towns = [] }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultValues: Partial<BlogPostFormValues> = initialData
    ? {
        ...initialData,
        tagIds: initialData.tags?.map((t: any) => t.tagId) || [],
        relatedTownIds: initialData.relatedTowns?.map((t: any) => t.townId) || [],
      }
    : {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "GENERAL",
        published: false,
        featured: false,
        tagIds: [],
        relatedTownIds: [],
      };

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues,
  });

  const onSubmit = (data: BlogPostFormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateBlogPost(initialData.id, data);
        } else {
          await createBlogPost(data);
        }
        router.push("/admin/blogs");
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. okun-history-overview" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short description for preview cards..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="HISTORY">History</SelectItem>
                  <SelectItem value="CULTURE">Culture</SelectItem>
                  <SelectItem value="DEVELOPMENT">Development</SelectItem>
                  <SelectItem value="DIASPORA">Diaspora</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write your blog post here..."
                  minHeight="400px"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Simplified multiple select using HTML native select for MVP */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="relatedTownIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Towns</FormLabel>
                <FormControl>
                  <select
                    multiple
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={field.value || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, (option) => option.value);
                      field.onChange(values);
                    }}
                  >
                    {towns.map((town) => (
                      <option key={town.id} value={town.id} className="py-1">
                        {town.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>Hold Ctrl/Cmd to select multiple.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <select
                    multiple
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={field.value || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, (option) => option.value);
                      field.onChange(values);
                    }}
                  >
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id} className="py-1">
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>Hold Ctrl/Cmd to select multiple.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6 border rounded-lg p-4 bg-muted/20">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Published</FormLabel>
                  <FormDescription>Make this post visible to the public.</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>Highlight this post on the homepage.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
