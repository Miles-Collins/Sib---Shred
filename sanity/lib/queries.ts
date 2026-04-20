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

export type SanitySiteLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type SanitySiteSettingsContent = {
  topRibbonText?: string;
  brandName?: string;
  brandSubtitle?: string;
  primaryNavLinks: SanitySiteLink[];
  headerCtaPrimary?: string;
  headerCtaSecondary?: string;
  footerTagline?: string;
  footerCompanyLinks: SanitySiteLink[];
  footerMenuLinks: SanitySiteLink[];
  supportPhone?: string;
  supportEmail?: string;
  footerCopyright?: string;
};

export type SanityMenuPageContent = {
  progressKicker?: string;
  progressSteps: string[];
  headerKicker?: string;
  headerTitle?: string;
  headerDescription?: string;
};

export type SanityMeal = {
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  allergens?: string;
  facilityNote?: string;
  dietaryTags: string[];
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  sodium?: string;
  ingredients: string[];
  isGlutenFree?: boolean;
  tag: string;
  price: string;
  imageUrl?: string;
};

export type SanityPlansPageCard = {
  label: string;
  title: string;
  text: string;
};

export type SanityPlansPageContent = {
  heroKicker?: string;
  heroTitle?: string;
  heroDescription?: string;
  valueCards: SanityPlansPageCard[];
  savingsKicker?: string;
  whyKicker?: string;
  whyTitle?: string;
  whyDescription?: string;
  whyCards: Array<{ title: string; text: string }>;
  faqKicker?: string;
  faqTitle?: string;
  faqs: Array<{ question: string; answer: string }>;
  bottomCtaKicker?: string;
  bottomCtaTitle?: string;
  bottomCtaButtonLabel?: string;
};

export type SanityCheckoutPageContent = {
  progressSteps: string[];
  headerKicker?: string;
  headerTitle?: string;
  headerDescription?: string;
  checkoutSteps: string[];
  successKicker?: string;
  successMessage?: string;
  missingFieldsError?: string;
  emptyCartError?: string;
  invalidCartError?: string;
  retentionKicker?: string;
  retentionCards: Array<{ title: string; text: string }>;
};

export type SanityMealDetailPageContent = {
  nutritionKicker?: string;
  nutritionTitle?: string;
  nutritionFootnote?: string;
  ingredientsTitle?: string;
  allergensPrefix?: string;
  autoDietaryTags: string[];
};

export type SanityJournalPageContent = {
  listKicker?: string;
  listTitle?: string;
  listDescription?: string;
  readArticleLabel?: string;
  fallbackExcerpt?: string;
  detailBackLabel?: string;
  detailEmptyBodyMessage?: string;
};

export type SanityOrderReceiptPageContent = {
  receiptKicker?: string;
  totalLabel?: string;
  paymentStatusPrefix?: string;
  subtotalLabel?: string;
  deliveryFeeLabel?: string;
  discountLabel?: string;
  totalSummaryLabel?: string;
  orderAgainLabel?: string;
  backToCheckoutLabel?: string;
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

const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  topRibbonText,
  brandName,
  brandSubtitle,
  primaryNavLinks[]{label, href},
  headerCtaPrimary,
  headerCtaSecondary,
  footerTagline,
  footerCompanyLinks[]{label, href, openInNewTab},
  footerMenuLinks[]{label, href},
  supportPhone,
  supportEmail,
  footerCopyright
}`;

const menuPageQuery = groq`*[_type == "menuPage"][0]{
  progressKicker,
  progressSteps,
  headerKicker,
  headerTitle,
  headerDescription
}`;

const mealsQuery = groq`*[_type == "meal" && isActive == true] | order(name asc){
  "slug": slug.current,
  name,
  subtitle,
  description,
  allergens,
  facilityNote,
  dietaryTags,
  calories,
  protein,
  carbs,
  fat,
  sodium,
  ingredients,
  isGlutenFree,
  tag,
  price,
  "imageUrl": image.asset->url,
  isFeatured
}`;

const plansPageQuery = groq`*[_type == "plansPage"][0]{
  heroKicker,
  heroTitle,
  heroDescription,
  valueCards[]{label, title, text},
  savingsKicker,
  whyKicker,
  whyTitle,
  whyDescription,
  whyCards[]{title, text},
  faqKicker,
  faqTitle,
  faqs[]{"question": question, "answer": answer},
  bottomCtaKicker,
  bottomCtaTitle,
  bottomCtaButtonLabel
}`;

const checkoutPageQuery = groq`*[_type == "checkoutPage"][0]{
  progressSteps,
  headerKicker,
  headerTitle,
  headerDescription,
  checkoutSteps,
  successKicker,
  successMessage,
  missingFieldsError,
  emptyCartError,
  invalidCartError,
  retentionKicker,
  retentionCards[]{title, text}
}`;

const mealDetailPageQuery = groq`*[_type == "mealDetailPage"][0]{
  nutritionKicker,
  nutritionTitle,
  nutritionFootnote,
  ingredientsTitle,
  allergensPrefix,
  autoDietaryTags
}`;

const journalPageQuery = groq`*[_type == "journalPage"][0]{
  listKicker,
  listTitle,
  listDescription,
  readArticleLabel,
  fallbackExcerpt,
  detailBackLabel,
  detailEmptyBodyMessage
}`;

const orderReceiptPageQuery = groq`*[_type == "orderReceiptPage"][0]{
  receiptKicker,
  totalLabel,
  paymentStatusPrefix,
  subtotalLabel,
  deliveryFeeLabel,
  discountLabel,
  totalSummaryLabel,
  orderAgainLabel,
  backToCheckoutLabel
}`;

function filterStringArray(items: string[] | undefined) {
  return Array.isArray(items) ? items.filter(Boolean) : [];
}

function filterLinkArray(items: SanitySiteLink[] | undefined) {
  return Array.isArray(items)
    ? items.filter((item) => item?.label && item?.href)
    : [];
}

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

export async function getSiteSettingsFromSanity(): Promise<SanitySiteSettingsContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const content = await sanityClient.fetch<SanitySiteSettingsContent | null>(siteSettingsQuery, {}, { next: { revalidate: 120 } });
    if (!content) {
      return null;
    }

    return {
      ...content,
      primaryNavLinks: filterLinkArray(content.primaryNavLinks),
      footerCompanyLinks: filterLinkArray(content.footerCompanyLinks),
      footerMenuLinks: filterLinkArray(content.footerMenuLinks),
    };
  } catch {
    return null;
  }
}

export async function getMenuPageContentFromSanity(): Promise<SanityMenuPageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const content = await sanityClient.fetch<SanityMenuPageContent | null>(menuPageQuery, {}, { next: { revalidate: 120 } });
    if (!content) {
      return null;
    }

    return {
      ...content,
      progressSteps: filterStringArray(content.progressSteps),
    };
  } catch {
    return null;
  }
}

export async function getMealsFromSanity(): Promise<SanityMeal[]> {
  if (!canUseSanityClient()) {
    return [];
  }

  try {
    const meals = await sanityClient.fetch<
      Array<SanityMeal & { isFeatured?: boolean }>
    >(mealsQuery, {}, { next: { revalidate: 120 } });

    const activeMeals = Array.isArray(meals)
      ? meals.filter((meal) => meal?.slug && meal?.name && meal?.description && meal?.price)
      : [];

    // Prefer featured docs when editors mark them, otherwise return all active meals.
    const featuredMeals = activeMeals.filter((meal) => meal.isFeatured === true);
    const selectedMeals = featuredMeals.length > 0 ? featuredMeals : activeMeals;

    return selectedMeals.map((meal) => ({
      slug: meal.slug,
      name: meal.name,
      subtitle: meal.subtitle,
      description: meal.description,
      allergens: meal.allergens,
      facilityNote: meal.facilityNote,
      dietaryTags: filterStringArray(meal.dietaryTags),
      calories: Number.isFinite(meal.calories) ? meal.calories : 0,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      sodium: meal.sodium,
      ingredients: filterStringArray(meal.ingredients),
      isGlutenFree: Boolean(meal.isGlutenFree),
      tag: meal.tag,
      price: meal.price,
      imageUrl: meal.imageUrl,
    }));
  } catch {
    return [];
  }
}

export async function getPlansPageContentFromSanity(): Promise<SanityPlansPageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const content = await sanityClient.fetch<SanityPlansPageContent | null>(plansPageQuery, {}, { next: { revalidate: 120 } });
    if (!content) {
      return null;
    }

    return {
      ...content,
      valueCards: Array.isArray(content.valueCards)
        ? content.valueCards.filter((item) => item?.label && item?.title && item?.text)
        : [],
      whyCards: Array.isArray(content.whyCards)
        ? content.whyCards.filter((item) => item?.title && item?.text)
        : [],
      faqs: Array.isArray(content.faqs)
        ? content.faqs.filter((item) => item?.question && item?.answer)
        : [],
    };
  } catch {
    return null;
  }
}

export async function getCheckoutPageContentFromSanity(): Promise<SanityCheckoutPageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const content = await sanityClient.fetch<SanityCheckoutPageContent | null>(checkoutPageQuery, {}, { next: { revalidate: 120 } });
    if (!content) {
      return null;
    }

    return {
      ...content,
      progressSteps: filterStringArray(content.progressSteps),
      checkoutSteps: filterStringArray(content.checkoutSteps),
      retentionCards: Array.isArray(content.retentionCards)
        ? content.retentionCards.filter((item) => item?.title && item?.text)
        : [],
    };
  } catch {
    return null;
  }
}

export async function getMealDetailPageContentFromSanity(): Promise<SanityMealDetailPageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    const content = await sanityClient.fetch<SanityMealDetailPageContent | null>(mealDetailPageQuery, {}, { next: { revalidate: 120 } });
    if (!content) {
      return null;
    }

    return {
      ...content,
      autoDietaryTags: filterStringArray(content.autoDietaryTags),
    };
  } catch {
    return null;
  }
}

export async function getJournalPageContentFromSanity(): Promise<SanityJournalPageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    return await sanityClient.fetch<SanityJournalPageContent | null>(journalPageQuery, {}, { next: { revalidate: 120 } });
  } catch {
    return null;
  }
}

export async function getOrderReceiptPageContentFromSanity(): Promise<SanityOrderReceiptPageContent | null> {
  if (!canUseSanityClient()) {
    return null;
  }

  try {
    return await sanityClient.fetch<SanityOrderReceiptPageContent | null>(orderReceiptPageQuery, {}, { next: { revalidate: 120 } });
  } catch {
    return null;
  }
}
