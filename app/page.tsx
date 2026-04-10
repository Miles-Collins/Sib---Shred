import Link from "next/link";

import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { MealCard } from "./components/landing/MealCard";
import {
  blogPosts,
  featuredMeals,
  goals,
  mealOptions,
  plans,
  testimonials,
} from "./components/landing/data";
import { getHomepagePostsFromSanity } from "@/sanity/lib/queries";

export default async function Home() {
  const categoryHighlights = [
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

  const valueBlocks = [
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

  const sanityPosts = await getHomepagePostsFromSanity();
  const renderedBlogPosts =
    sanityPosts.length > 0
      ? sanityPosts.map((post) => ({
          title: post.title,
          date: post.date,
          href: `/about#my-story`,
        }))
      : blogPosts.map((post) => ({
          ...post,
          href: "/about#my-story",
        }));

  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 pb-20 pt-4 sm:px-8">
        <Hero />

        <section className="motion-reveal brand-grid brand-panel grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
          {categoryHighlights.map((item, index) => (
            <article
              key={item.title}
              className="motion-lift motion-stagger rounded-[1.4rem] border border-[var(--line)] bg-white/95 p-5"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <p className="brand-kicker text-[var(--berry)]">
                category
              </p>
              <h3 className="brand-section-title mt-2 text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="motion-reveal brand-panel-strong px-6 py-5 text-white sm:px-9">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="brand-section-title text-2xl sm:text-3xl">
              Trusted by people who want great meals without the daily prep.
            </h2>
            <a
              href="#reviews"
              className="brand-control w-fit rounded-md bg-white px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--ink)]"
            >
              View Reviews
            </a>
          </div>
        </section>

        <section className="motion-reveal texture-dots overflow-hidden rounded-3xl border border-[var(--line)] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="brand-kicker text-[var(--muted)]">Alysha&apos;s kitchen standard</p>
              <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
                Premium meal prep should feel personal, not mass-produced.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                Every menu drop is intentionally small-batch. The recipes, packaging,
                and final quality check are handled by Alysha so each delivery feels
                like a thoughtful weekly reset, not a generic subscription box.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  label: "Small batch",
                  text: "Cooked in limited runs for consistency and freshness.",
                },
                {
                  label: "Real support",
                  text: "Questions go directly to Alysha, not a ticket queue.",
                },
              ].map((item) => (
                <article key={item.label} className="rounded-2xl border border-[var(--line)] bg-white p-5">
                  <p className="brand-kicker text-[var(--berry)]">{item.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="menu" className="motion-reveal space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="brand-kicker text-[var(--muted)]">
                Weekly spotlight
              </p>
              <h2 className="brand-section-title mt-1 text-3xl sm:text-4xl">
                Featured meals
              </h2>
            </div>
            <Link
              href="/menu"
              className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
            >
              View all 40+ meals
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredMeals.map((meal, index) => (
              <MealCard key={meal.name} meal={meal} delayMs={index * 90} />
            ))}
          </div>
        </section>

        <section className="motion-reveal brand-shell space-y-5 p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="brand-kicker text-[var(--muted)]">
                Meal options
              </p>
              <h2 className="brand-section-title mt-1 text-3xl">Pick your path</h2>
            </div>
            <Link
              href="/menu"
              className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
            >
              See full menu
            </Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {mealOptions.map((option) => (
              <Link
                key={option}
                href="/menu"
                className="rounded-full border border-[var(--line)] bg-[var(--bg-cream)] px-4 py-2 text-sm font-semibold"
              >
                {option}
              </Link>
            ))}
          </div>
        </section>

        <section id="how" className="motion-reveal space-y-5">
          <p className="brand-kicker text-[var(--muted)]">
            Meal prep made easy
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
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
            ].map((step, index) => (
              <article
                key={step.title}
                className="motion-lift motion-stagger brand-panel p-5"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <p className="brand-kicker text-[var(--berry)]">
                  Step {index + 1}
                </p>
                <h3 className="brand-section-title mt-2 text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="motion-reveal brand-shell grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="brand-kicker text-[var(--muted)]">
              Why it stands out
            </p>
            <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
              The convenience of big meal kits, with one-on-one kitchen quality.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              Enjoy premium flavors, clean ingredients, and delivery that respects
              your week. It is a smarter way to eat well without spending nights
              shopping, prepping, and cleaning.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {goals.map((goal) => (
              <div
                key={goal}
                className="motion-badge brand-badge brand-badge--charcoal rounded-[0.35rem] px-3 py-4 text-center text-sm"
              >
                {goal}
              </div>
            ))}
          </div>
        </section>

        <section className="motion-reveal brand-panel-strong overflow-hidden p-6 text-white sm:p-9">
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
            <table className="w-full min-w-[650px] border-separate border-spacing-y-2 text-left text-sm">
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
                <tr className="bg-[var(--sun)] text-[var(--ink)]">
                  <td className="px-3 py-3 font-black">Sibshred Kitchen</td>
                  <td className="px-3 py-3 font-semibold">~5 min</td>
                  <td className="px-3 py-3 font-semibold">From $8.75</td>
                  <td className="px-3 py-3 font-semibold">Heat, eat, move on</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="plans" className="motion-reveal space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="brand-kicker text-[var(--muted)]">
                Subscribe and save
              </p>
              <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
                Flexible weekly plans
              </h2>
            </div>
            <Link
              href="/plans"
              className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Compare plans
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.title}
                className="motion-lift brand-panel p-6"
              >
                <p className="brand-kicker text-[var(--muted)]">
                  {plan.title}
                </p>
                <p className="mt-2 text-lg font-semibold">{plan.detail}</p>
                <p className="mt-5 text-4xl font-black tracking-tight">{plan.price}</p>
                <p className="text-sm text-[var(--muted)]">per week</p>
                <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
                  <li>Chef-prepared weekly menus</li>
                  <li>Pause or skip anytime</li>
                  <li>Fresh local delivery</li>
                </ul>
                <Link
                  href="/checkout"
                  className="brand-control mt-6 inline-block w-full rounded-full bg-[var(--ink)] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.1em] text-white"
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
              className="motion-lift motion-stagger brand-panel p-5"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <h3 className="brand-section-title text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
              <a
                href="/about#my-story"
                className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.1em] text-[var(--berry)]"
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
          <p className="brand-kicker text-[var(--muted)]">
            Testimonials
          </p>
          <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
            Customers staying on track, week after week.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {testimonials.map((quote) => (
              <blockquote
                key={quote}
                className="rounded-2xl bg-[var(--bg-cream)] p-5 text-sm leading-relaxed"
              >
                &ldquo;{quote}&rdquo;
              </blockquote>
            ))}
          </div>
        </section>

        <section id="blog" className="motion-reveal space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="brand-kicker text-[var(--muted)]">
                From the journal
              </p>
              <h2 className="brand-section-title mt-1 text-3xl sm:text-4xl">
                Tips, nutrition, and updates
              </h2>
            </div>
            <a
              href="/about"
              className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Read my story
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {renderedBlogPosts.map((post) => (
              <article
                key={post.title}
                className="motion-lift brand-panel p-5"
              >
                <p className="brand-kicker text-[var(--muted)]">
                  {post.date}
                </p>
                <h3 className="mt-3 text-xl leading-tight font-extrabold">
                  {post.title}
                </h3>
                <a
                  href={post.href}
                  className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.1em] text-[var(--berry)]"
                >
                  Read article
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-[var(--mint)]/45 p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Start today
              </p>
              <h2 className="mt-2 text-3xl leading-tight font-black tracking-tight sm:text-5xl">
                Ready to skip grocery lines this week?
              </h2>
            </div>
            <Link
              href="/checkout"
              className="rounded-full bg-[var(--ink)] px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white"
            >
              Build My First Box
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] bg-white/70">
        <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-8 text-sm text-[var(--muted)] sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <div>
            <p className="text-lg font-black text-[var(--ink)]">SIBSHRED</p>
              <p className="mt-1">Healthy Meals Delivered by Alysha</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-[var(--ink)]">Company</p>
            <Link href="/about" className="block">
              About
            </Link>
            <a href="/about#my-story" className="block">
              FAQ
            </a>
            <a href="mailto:info@sibshredkitchen.com" className="block">
              Contact Us
            </a>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-[var(--ink)]">Menu</p>
            <Link href="/menu" className="block">
              Weekly Menu
            </Link>
            <Link href="/plans" className="block">
              Subscription Plans
            </Link>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-[var(--ink)]">Support</p>
            <p>(866) 442-3287</p>
            <p>info@sibshredkitchen.com</p>
          </div>
        </div>
        <div className="border-t border-[var(--line)] px-5 py-4 text-center text-xs text-[var(--muted)] sm:px-8">
          © 2026 Sibshred Kitchen - All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
