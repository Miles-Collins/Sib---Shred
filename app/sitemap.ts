import type { MetadataRoute } from "next";

import { featuredMeals } from "./components/landing/data";
import { getAllJournalPostsFromSanity } from "@/sanity/lib/queries";
import { siteUrl } from "@/lib/seo";

function toUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const journalPosts = await getAllJournalPostsFromSanity();

  return [
    {
      url: toUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: toUrl("/menu"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: toUrl("/plans"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: toUrl("/journal"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    ...featuredMeals.map((meal) => ({
      url: toUrl(`/menu/${meal.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...journalPosts.map((post) => ({
      url: toUrl(`/journal/${post.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
  ];
}
