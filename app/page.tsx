import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { FeaturedMealsCarousel } from "./components/landing/FeaturedMealsCarousel";
import {
  blogPosts,
  goals,
  mealOptions,
  plans,
  testimonials,
} from "./components/landing/data";
import { getHomePageContentFromSanity, getHomepagePostsFromSanity } from "@/sanity/lib/queries";
import { getAllMealCatalog, getMealCatalog } from "@/lib/meal-catalog";
import { buildPageMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sib Method | Tropical Meal Prep Delivery",
  description:
    "Fresh, chef-prepared weekly meal prep with flexible plans, local delivery, and a high-touch experience.",
  path: "/",
});

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": ["Organization", "WebSite"],
  name: "Sib Method",
  url: siteUrl,
  description:
    "Fresh, chef-prepared weekly meal prep with flexible plans, local delivery, and a high-touch experience.",
  sameAs: ["https://www.instagram.com/sibmethod/"],
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default async function Home() {
  const mealCatalog = await getMealCatalog();
  const allMealCatalog = await getAllMealCatalog();
  const defaultCategoryHighlights = [
    {
      title: "Under 500",
      text: "High flavor meals dialed in for lighter days.",
    },
    {
      title: "Gluten Free",
      text: "Simple ingredients and options your body loves.",
    },
    {
      title: "Vegetarian",
      text: "Plant-forward meals with real protein power.",
    },
    {
      title: "Low Carb",
      text: "Smart carb cuts without giving up satisfaction.",
    },
  ];

  const defaultValueBlocks = [
    {
      title: "Free Nutrition Guidance",
      text: "Get practical guidance directly from me when you need help dialing in your plan.",
    },
    {
      title: "Local Sourcing Priority",
      text: "I source from regional suppliers to keep meals fresher and support local producers.",
    },
    {
      title: "Sustainable Packaging",
      text: "Responsible insulation and recyclable components reduce waste without compromising quality.",
    },
    {
      title: "Concierge-Level Support",
      text: "Questions about plans, delivery, or ingredients? I make ordering personal and easy.",
    },
  ];

  const defaultKitchenCards = [
    {
      label: "Small batch",
      text: "Cooked in limited runs for consistency and freshness.",
    },
    {
      label: "Real support",
      text: "Questions go directly to Alysha, not a ticket queue.",
    },
  ];

  const defaultMealPrepSteps = [
    {
      title: "Pick your meals",
      text: "Choose from chef-prepared weekly drops that fit your goals.",
    },
    {
      title: "I cook fresh",
      text: "Meals are made locally in small batches for freshness.",
    },
    {
      title: "I deliver",
      text: "Convenient drop-offs to home or office on your schedule.",
    },
    {
      title: "Heat & repeat",
      text: "Ready in minutes so healthy eating stays effortless.",
    },
  ];

  const homeContent = await getHomePageContentFromSanity();
  const categoryHighlights = homeContent?.categoryHighlights.length
    ? homeContent.categoryHighlights
    : defaultCategoryHighlights;
  const valueBlocks = homeContent?.valueBlocks.length
    ? homeContent.valueBlocks
    : defaultValueBlocks;
  const kitchenCards = homeContent?.kitchenCards.length
    ? homeContent.kitchenCards
    : defaultKitchenCards;
  const mealPrepSteps = homeContent?.mealPrepSteps.length
    ? homeContent.mealPrepSteps
    : defaultMealPrepSteps;
  const renderedGoals = homeContent?.goals.length ? homeContent.goals : goals;
  const renderedTestimonials = homeContent?.testimonials.length ? homeContent.testimonials : testimonials;

  const sanityPosts = await getHomepagePostsFromSanity();
  const renderedBlogPosts =
    sanityPosts.length > 0
      ? sanityPosts.map((post) => ({
          title: post.title,
          date: post.date,
          href: `/journal/${post.slug}`,
        }))
      : blogPosts.map((post) => ({
          ...post,
          href: `/journal/${slugify(post.title)}`,
        }));

  return (
    <div className="flex min-h-full flex-col bg-(--background) text-(--ink)">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />

      <main className="flex w-full flex-col gap-14 pb-20 pt-4 md:pb-28 xl:pb-20">
        <Hero />

        <section className="motion-reveal brand-grid grid gap-3 rounded-3xl border border-[#e4cfb0] bg-[#F5E6D3] p-4 md:grid-cols-2 lg:grid-cols-4">
          {categoryHighlights.map((item, index) => (
            <article
              key={item.title}
              className={`motion-lift motion-stagger rounded-[1.4rem] border border-[#e4cfb0] bg-[#F5E6D3] p-5 stagger-delay-${index}`}
            >
              <p className="brand-kicker text-(--berry)">
                category
              </p>
              <h3 className="brand-section-title mt-2 text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--muted)">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="motion-reveal rounded-3xl border border-[#e4cfb0] bg-[#F5E6D3] px-6 py-5 text-(--ink) sm:px-9">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="brand-section-title text-2xl sm:text-3xl">
              {homeContent?.trustedHeadline || "Trusted by people who want great meals without the daily prep."}
            </h2>
            <a
              href="#reviews"
              className="brand-control w-fit rounded-md bg-[#5FA8C7] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white"
            >
              {homeContent?.trustedCtaLabel || "View Reviews"}
            </a>
          </div>
        </section>

        <section className="motion-reveal overflow-hidden rounded-3xl border border-[#e4cfb0] bg-[#F5E6D3] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="brand-kicker text-(--muted)">{homeContent?.kitchenKicker || "Alysha's kitchen standard"}</p>
              <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
                {homeContent?.kitchenHeadline || "Refined meal prep should feel personal, not mass-produced."}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--muted) sm:text-base">
                {homeContent?.kitchenDescription || "Every menu drop is intentionally small-batch. The recipes, packaging, and final quality check are handled by Alysha so each delivery feels like a thoughtful weekly reset, not a generic subscription box."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {kitchenCards.map((item) => (
                <article key={item.label} className="rounded-2xl border border-[#e4cfb0] bg-[#F5E6D3] p-5">
                  <p className="brand-kicker text-(--berry)">{item.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-(--muted)">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="menu" className="motion-reveal weekly-specials-shell space-y-6 py-7 sm:py-9">
          <div className="text-center">
            <h2 className="brand-section-title text-3xl sm:text-5xl">Weekly Specials</h2>
          </div>

          <FeaturedMealsCarousel meals={mealCatalog} allMeals={allMealCatalog} />
        </section>

        <section className="motion-reveal space-y-5 rounded-3xl border border-[#e4cfb0] bg-[#F5E6D3] p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="brand-kicker text-(--muted)">
                Meal options
              </p>
              <h2 className="brand-section-title mt-1 text-3xl">Pick your path</h2>
            </div>
            <Link
              href="/menu"
              className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-(--ink) underline-offset-4 hover:underline"
            >
              See full menu
            </Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {mealOptions.map((option) => (
              <Link
                key={option}
                href="/menu"
                className="rounded-full border border-[#e4cfb0] bg-white px-4 py-2 text-sm font-semibold"
              >
                {option}
              </Link>
            ))}
          </div>
        </section>

        <section id="how" className="motion-reveal space-y-5">
          <p className="brand-kicker text-(--muted)">
            Meal prep made easy
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mealPrepSteps.map((step, index) => (
              <article
                key={step.title}
                className={`motion-lift motion-stagger rounded-2xl border border-[#e4cfb0] bg-[#F5E6D3] p-5 stagger-delay-${index}`}
              >
                <p className="brand-kicker text-(--berry)">
                  Step {index + 1}
                </p>
                <h3 className="brand-section-title mt-2 text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-(--muted)">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="motion-reveal grid gap-8 rounded-3xl border border-[#e4cfb0] bg-[#F5E6D3] p-6 sm:p-9 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="brand-kicker text-(--muted)">
              Why it stands out
            </p>
            <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
              {homeContent?.whyHeadline || "The convenience of big meal kits, with one-on-one kitchen quality."}
            </h2>
            <p className="mt-4 max-w-xl text-(--muted)">
              {homeContent?.whyDescription || "Enjoy elevated flavors, clean ingredients, and delivery that respects your week. It is a smarter way to eat well without spending nights shopping, prepping, and cleaning."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {renderedGoals.map((goal) => (
              <div
                key={goal}
                className="motion-badge brand-badge brand-badge--charcoal rounded-[0.35rem] px-3 py-4 text-center text-sm"
              >
                {goal}
              </div>
            ))}
          </div>
        </section>

        <section className="motion-reveal overflow-hidden rounded-3xl border border-[#e4cfb0] bg-[#F5E6D3] p-6 text-(--ink) sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="brand-section-title max-w-lg text-3xl sm:text-4xl">
              You are busy. Your nutrition plan should not be.
            </h2>
            <p className="max-w-sm text-sm text-white/80">
              A quick snapshot of where meal prep saves time without sacrificing
              quality.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="menu-table w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-white/75">
                  <th className="px-3 py-2">Option</th>
                  <th className="px-3 py-2">Time per meal</th>
                  <th className="px-3 py-2">Typical cost</th>
                  <th className="px-3 py-2">Effort</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white/10">
                  <td className="px-3 py-3 font-semibold">Takeout</td>
                  <td className="px-3 py-3">~45 min</td>
                  <td className="px-3 py-3">$14 + fees</td>
                  <td className="px-3 py-3">Ordering + waiting</td>
                </tr>
                <tr className="bg-white/10">
                  <td className="px-3 py-3 font-semibold">Cook at home</td>
                  <td className="px-3 py-3">~60 min</td>
                  <td className="px-3 py-3">$7 to $11</td>
                  <td className="px-3 py-3">Planning + shopping + cooking</td>
                </tr>
                <tr className="bg-(--sun) text-(--ink)">
                  <td className="px-3 py-3 font-black">Sib Method</td>
                  <td className="px-3 py-3 font-semibold">~5 min</td>
                  <td className="px-3 py-3 font-semibold">From $7.00</td>
                  <td className="px-3 py-3 font-semibold">Heat, eat, move on</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="plans" className="motion-reveal space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="brand-kicker text-(--muted)">
                Subscribe and save
              </p>
              <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
                Flexible weekly plans
              </h2>
            </div>
            <Link
              href="/plans"
              className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-(--ink) underline-offset-4 hover:underline"
            >
              Compare plans
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.title}
                className="motion-lift brand-panel p-6"
              >
                <p className="brand-kicker text-(--muted)">
                  {plan.title}
                </p>
                <p className="mt-2 text-lg font-semibold">{plan.detail}</p>
                <p className="mt-5 text-4xl font-black tracking-tight">{plan.price}</p>
                <p className="text-sm text-(--muted)">per week</p>
                <ul className="mt-4 space-y-1 text-sm text-(--muted)">
                  <li>Chef-prepared weekly menus</li>
                  <li>Pause or skip anytime</li>
                  <li>Fresh local delivery</li>
                </ul>
                <Link
                  href="/checkout"
                  className="brand-control mt-6 inline-block w-full rounded-full bg-(--ink) px-4 py-3 text-center text-sm font-bold uppercase tracking-widest text-white"
                >
                  Select Plan
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="motion-reveal grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {valueBlocks.map((item, index) => (
            <article
              key={item.title}
                className={`motion-lift motion-stagger brand-panel p-5 stagger-delay-${index}`}
            >
              <h3 className="brand-section-title text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--muted)">{item.text}</p>
              <a
                href="/about#my-story"
                className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-(--berry)"
              >
                Learn more
              </a>
            </article>
          ))}
        </section>

        <section
          id="reviews"
          className="motion-reveal brand-shell p-6 sm:p-9"
        >
          <p className="brand-kicker text-(--muted)">
            Testimonials
          </p>
          <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
            Customers staying on track, week after week.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {renderedTestimonials.map((quote) => (
              <blockquote
                key={quote}
                className="rounded-2xl border border-[#e4cfb0] bg-[#F5E6D3] p-5 text-sm leading-relaxed"
              >
                &ldquo;{quote}&rdquo;
              </blockquote>
            ))}
          </div>
        </section>

        <section id="blog" className="motion-reveal space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="brand-kicker text-(--muted)">
                From the journal
              </p>
              <h2 className="brand-section-title mt-1 text-3xl sm:text-4xl">
                Tips, nutrition, and updates
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-sm font-bold uppercase tracking-[0.12em] text-(--ink) underline-offset-4 hover:underline"
            >
              Read all posts
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {renderedBlogPosts.map((post) => (
              <article
                key={post.title}
                className="motion-lift rounded-2xl border border-[#e4cfb0] bg-[#F5E6D3] p-5"
              >
                <p className="brand-kicker text-(--muted)">
                  {post.date}
                </p>
                <h3 className="mt-3 text-xl leading-tight font-extrabold">
                  {post.title}
                </h3>
                <Link
                  href={post.href}
                  className="mt-5 inline-block text-xs font-bold uppercase tracking-widest text-(--berry)"
                >
                  Read article
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#e4cfb0] bg-[#F5E6D3] p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">
                {homeContent?.startCtaKicker || "Start today"}
              </p>
              <h2 className="mt-2 text-3xl leading-tight font-black tracking-tight sm:text-5xl">
                {homeContent?.startCtaHeadline || "Ready to skip grocery lines this week?"}
              </h2>
            </div>
            <Link
              href="/checkout"
              className="rounded-full bg-[#5FA8C7] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white"
            >
              {homeContent?.startCtaButtonLabel || "Build My First Box"}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
