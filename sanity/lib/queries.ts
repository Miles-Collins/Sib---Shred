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

export type SanityHomePageContent = {
  trustedHeadline?: string;
  trustedCtaLabel?: string;
  kitchenKicker?: string;
  kitchenHeadline?: string;
  kitchenDescription?: string;
  kitchenCards: Array<{ label: string; text: string }>;
  categoryHighlights: Array<{ title: string; text: string }>;
  mealPrepSteps: Array<{ title: string; text: string }>;
  whyHeadline?: string;
  whyDescription?: string;
  goals: string[];
  valueBlocks: Array<{ title: string; text: string }>;
  testimonials: string[];
  startCtaKicker?: string;
  startCtaHeadline?: string;
  startCtaButtonLabel?: string;
};

export type SanityAboutPageContent = {
  portraitImageUrl?: string;
  introKicker?: string;
  introHeadline?: string;
  introBody1?: string;
  introBody2?: string;
  whoAmIBody?: string;
  whyStartBody?: string;
  whoForBody?: string;
  howItWorksSteps: string[];
  pillars: Array<{ label: string; text: string }>;
  contactHeadline?: string;
  contactButtonLabel?: string;
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

const homePageQuery = groq`*[_type == "homePage"][0]{
  trustedHeadline,
  trustedCtaLabel,
  kitchenKicker,
  kitchenHeadline,
  kitchenDescription,
  kitchenCards[]{label, text},
  categoryHighlights[]{title, text},
  mealPrepSteps[]{title, text},
  whyHeadline,
  whyDescription,
  goals,
  valueBlocks[]{title, text},
  testimonials,
  startCtaKicker,
  startCtaHeadline,
  startCtaButtonLabel
}`;

const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  "portraitImageUrl": portraitImage.asset->url,
  introKicker,
  introHeadline,
  introBody1,
  introBody2,
  whoAmIBody,
  whyStartBody,
  whoForBody,
  howItWorksSteps,
  pillars[]{label, text},
  contactHeadline,
  contactButtonLabel
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

export async function getHomePageContentFromSanity(): Promise<SanityHomePageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const content = await sanityClient.fetch<SanityHomePageContent | null>(homePageQuery, {}, { next: { revalidate: 120 } });
    if (!content) {
      return null;
    }

    return {
      ...content,
      kitchenCards: Array.isArray(content.kitchenCards) ? content.kitchenCards.filter((item) => item?.label && item?.text) : [],
      categoryHighlights: Array.isArray(content.categoryHighlights) ? content.categoryHighlights.filter((item) => item?.title && item?.text) : [],
      mealPrepSteps: Array.isArray(content.mealPrepSteps) ? content.mealPrepSteps.filter((item) => item?.title && item?.text) : [],
      goals: Array.isArray(content.goals) ? content.goals.filter(Boolean) : [],
      valueBlocks: Array.isArray(content.valueBlocks) ? content.valueBlocks.filter((item) => item?.title && item?.text) : [],
      testimonials: Array.isArray(content.testimonials) ? content.testimonials.filter(Boolean) : [],
    };
  } catch {
    return null;
  }
}

export async function getAboutPageContentFromSanity(): Promise<SanityAboutPageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const content = await sanityClient.fetch<SanityAboutPageContent | null>(aboutPageQuery, {}, { next: { revalidate: 120 } });
    if (!content) {
      return null;
    }

    return {
      ...content,
      howItWorksSteps: Array.isArray(content.howItWorksSteps) ? content.howItWorksSteps.filter(Boolean) : [],
      pillars: Array.isArray(content.pillars) ? content.pillars.filter((item) => item?.label && item?.text) : [],
    };
  } catch {
    return null;
  }
}
