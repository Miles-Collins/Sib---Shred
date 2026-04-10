import { groq } from "next-sanity";

import { canUseSanityClient, sanityClient } from "./client";

export type SanityHomepagePost = {
  title: string;
  date: string;
  slug: string;
};

const homePostsQuery = groq`*[_type == "post" && featured == true] | order(publishedAt desc)[0...3]{
  title,
  "slug": slug.current,
  publishedAt
}`;

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
