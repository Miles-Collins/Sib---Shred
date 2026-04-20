import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "../components/landing/Header";
import { blogPosts } from "../components/landing/data";
import { getAllJournalPostsFromSanity, getJournalPageContentFromSanity } from "@/sanity/lib/queries";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Journal | Meal Prep Tips & Nutrition Notes",
  description:
    "Read practical meal prep tips, nutrition notes, and updates from Alysha's kitchen.",
  path: "/journal",
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default async function JournalPage() {
  const pageContent = await getJournalPageContentFromSanity();
  const sanityPosts = await getAllJournalPostsFromSanity();
  const posts =
    sanityPosts.length > 0
      ? sanityPosts
      : blogPosts.map((post) => ({
          title: post.title,
          date: post.date,
          slug: slugify(post.title),
          excerpt: pageContent?.fallbackExcerpt || "Fresh updates from Alysha's kitchen.",
          body: [],
        }));

  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <section className="brand-shell p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            {pageContent?.listKicker || "Journal"}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {pageContent?.listTitle || "Notes from Alysha's kitchen"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {pageContent?.listDescription ||
              "Recipes, nutrition notes, and practical meal prep tips. When Sanity is connected, posts published there appear here automatically."}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="motion-lift brand-panel p-5">
              <p className="brand-kicker text-[var(--muted)]">{post.date}</p>
              <h2 className="mt-3 text-2xl leading-tight font-extrabold">{post.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
              <Link
                href={`/journal/${post.slug}`}
                className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.1em] text-[var(--berry)]"
              >
                {pageContent?.readArticleLabel || "Read article"}
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
