import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "../../components/landing/Header";
import { blogPosts } from "../../components/landing/data";
import {
  getAllJournalPostsFromSanity,
  getJournalPostBySlugFromSanity,
} from "@/sanity/lib/queries";
import { buildPageMetadata } from "@/lib/seo";

type JournalPostPageProps = {
  params: Promise<{ slug: string }>;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function fallbackPostBySlug(slug: string) {
  const post = blogPosts.find((item) => slugify(item.title) === slug);

  if (!post) {
    return null;
  }

  return {
    title: post.title,
    slug,
    date: post.date,
    excerpt: "Fresh updates from Alysha's kitchen.",
    body: [
      "This article is currently using local fallback content.",
      "Once your Sanity project is connected and posts are published, this page will automatically render full CMS content.",
    ],
  };
}

export async function generateStaticParams() {
  const sanityPosts = await getAllJournalPostsFromSanity();

  if (sanityPosts.length > 0) {
    return sanityPosts.map((post) => ({ slug: post.slug }));
  }

  return blogPosts.map((post) => ({ slug: slugify(post.title) }));
}

export async function generateMetadata({ params }: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sanityPost = await getJournalPostBySlugFromSanity(slug);
  const post = sanityPost || fallbackPostBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Journal Post | Sib Method",
      description: "Meal prep and nutrition notes from Sib Method.",
      path: "/journal",
    });
  }

  return buildPageMetadata({
    title: `${post.title} | Sib Method Journal`,
    description: post.excerpt,
    path: `/journal/${post.slug}`,
  });
}

export default async function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = await params;
  const sanityPost = await getJournalPostBySlugFromSanity(slug);
  const post = sanityPost || fallbackPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <div className="text-[15px] text-[var(--muted)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/journal" className="hover:underline">
            Journal
          </Link>{" "}
          / {post.title}
        </div>

        <article className="brand-shell p-6 sm:p-8">
          <p className="brand-kicker text-[var(--muted)]">{post.date}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{post.excerpt}</p>

          <div className="mt-8 space-y-4 text-[1.02rem] leading-relaxed text-[var(--ink)]">
            {post.body.length > 0 ? (
              post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>Content for this post will appear here once published in Sanity Studio.</p>
            )}
          </div>

          <div className="mt-8">
            <Link
              href="/journal"
              className="brand-control rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
            >
              Back to journal
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
