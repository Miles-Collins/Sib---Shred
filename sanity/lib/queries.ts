import { groq } from "next-sanity";

import { canUseSanityClient, sanityClient } from "./client";

export type SanityHomepagePost = {
  title: string;
  date: string;
  slug: string;
};

export type SanityJournalPost = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  body: string[];
};

const homePostsQuery = groq`*[_type == "post" && featured == true] | order(publishedAt desc)[0...3]{
  title,
  "slug": slug.current,
  publishedAt
}`;

const allPostsQuery = groq`*[_type == "post"] | order(publishedAt desc){
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  body
}`;

const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  body
}`;

function toTextBlocks(body: Array<{ children?: Array<{ text?: string }> }> | undefined) {
  if (!Array.isArray(body)) {
    return [];
  }

  return body
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((child) => child.text || "").join("")
        : "",
    )
    .map((text) => text.trim())
    .filter(Boolean);
}

export async function getHomepagePostsFromSanity(): Promise<SanityHomepagePost[]> {
  if (!canUseSanityClient()) {
    return [];
  }

  try {
    const posts = await sanityClient.fetch<
      Array<{ title: string; slug: string; publishedAt: string }>
    >(homePostsQuery, {}, { next: { revalidate: 120 } });

    return posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      date: new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));
  } catch {
    return [];
  }
}

export async function getAllJournalPostsFromSanity(): Promise<SanityJournalPost[]> {
  if (!canUseSanityClient()) {
    return [];
  }

  try {
    const posts = await sanityClient.fetch<
      Array<{
        title: string;
        slug: string;
        publishedAt: string;
        excerpt?: string;
        body?: Array<{ children?: Array<{ text?: string }> }>;
      }>
    >(allPostsQuery, {}, { next: { revalidate: 120 } });

    return posts.map((post) => {
      const body = toTextBlocks(post.body);

      return {
        title: post.title,
        slug: post.slug,
        date: new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        excerpt:
          post.excerpt?.trim() ||
          body[0] ||
          "Fresh updates from Alysha's kitchen.",
        body,
      };
    });
  } catch {
    return [];
  }
}

export async function getJournalPostBySlugFromSanity(
  slug: string,
): Promise<SanityJournalPost | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const post = await sanityClient.fetch<{
      title: string;
      slug: string;
      publishedAt: string;
      excerpt?: string;
      body?: Array<{ children?: Array<{ text?: string }> }>;
    } | null>(postBySlugQuery, { slug }, { next: { revalidate: 120 } });

    if (!post) {
      return null;
    }

    const body = toTextBlocks(post.body);

    return {
      title: post.title,
      slug: post.slug,
      date: new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      excerpt:
        post.excerpt?.trim() ||
        body[0] ||
        "Fresh updates from Alysha's kitchen.",
      body,
    };
  } catch {
    return null;
  }
}
