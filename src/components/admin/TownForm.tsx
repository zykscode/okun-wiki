/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TownSchema, type TownFormValues } from "@/features/town/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createTown, updateTown } from "@/features/town/actions";
import { useRouter } from "next/navigation";

interface TownFormProps {
  initialData?: any; // To do: use specific type
  lgas: { id: string; name: string }[];
  tribes: { id: string; name: string }[];
}

export function TownForm({ initialData, lgas, tribes }: TownFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultValues: Partial<TownFormValues> = initialData || {
    name: "",
    slug: "",
    tagline: "",
    overview: "",
    metaDescription: "",
    published: false,
    featured: false,
    lgaId: "",
    tribeId: "",
  };

  const form = useForm<TownFormValues>({
    resolver: zodResolver(TownSchema),
    defaultValues,
  });

  const onSubmit = (data: TownFormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateTown(initialData.id, data);
        } else {
          await createTown(data);
        }
        router.push("/admin/towns");
        router.refresh();
      } catch (error) {
        console.error(error);
        // Toast error here ideally
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Kabba" {...field} />
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
                  <Input placeholder="e.g. kabba" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief catchphrase or motto"
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
          name="overview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overview</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the town..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lgaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LGA</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an LGA" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lgas.map((lga) => (
                      <SelectItem key={lga.id} value={lga.id}>
                        {lga.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tribeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tribe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Tribe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tribes.map((tribe) => (
                      <SelectItem key={tribe.id} value={tribe.id}>
                        {tribe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="population"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Population</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="E.g. 50000"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value) : null)
                    }
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="founded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. 1400 AD" {...field} value={field.value || ""} />
                </FormControl>
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
                  <FormDescription>Make this town visible to the public.</FormDescription>
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
                  <FormDescription>Highlight this town on the homepage.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Town"}
        </Button>
      </form>
    </Form>
  );
}
