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
  steps,
  testimonials,
} from "./components/landing/data";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-18 px-5 pb-20 sm:px-8">
        <Hero />

        <section id="menu" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Weekly spotlight
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                Featured meals
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
            >
              View all 40+ meals
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredMeals.map((meal) => (
              <MealCard key={meal.name} meal={meal} />
            ))}
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-[var(--line)] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Meal options
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">Shop by category</h2>
            </div>
            <Link
              href="/menu"
              className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
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

        <section className="grid gap-8 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-9 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Meal paths
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Pick meals by your goal, not by guesswork.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              Choose from rotating categories built by dietitians and chefs. Mix
              and match every week with no long-term contracts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {goals.map((goal) => (
              <div
                key={goal}
                className="rounded-xl border border-[var(--line)] bg-[var(--bg-cream)] px-3 py-4 text-center text-sm font-bold uppercase tracking-[0.09em]"
              >
                {goal}
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            How it works
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-[var(--line)] bg-white p-5"
              >
                <p className="text-xs font-bold tracking-[0.14em] text-[var(--berry)] uppercase">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-extrabold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--ink)] p-6 text-white sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-lg text-3xl leading-tight font-black sm:text-4xl">
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

        <section id="plans" className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Subscribe and save
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Flexible weekly plans
              </h2>
            </div>
            <Link
              href="/plans"
              className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Compare plans
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.title}
                className="rounded-2xl border border-[var(--line)] bg-white p-6"
              >
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {plan.title}
                </p>
                <p className="mt-2 text-lg font-semibold">{plan.detail}</p>
                <p className="mt-5 text-4xl font-black tracking-tight">{plan.price}</p>
                <p className="text-sm text-[var(--muted)]">per week</p>
                <Link
                  href="/checkout"
                  className="mt-6 inline-block w-full rounded-full bg-[var(--ink)] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.1em] text-white"
                >
                  Select Plan
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          id="reviews"
          className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-9"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            People staying on track, week after week.
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

        <section id="blog" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                From our blog
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                Tips, nutrition, and updates
              </h2>
            </div>
            <a
              href="#"
              className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Read all posts
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="rounded-2xl border border-[var(--line)] bg-white p-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {post.date}
                </p>
                <h3 className="mt-3 text-xl leading-tight font-extrabold">
                  {post.title}
                </h3>
                <a
                  href="#"
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
            <p className="mt-1">Healthy Meals Delivered</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-[var(--ink)]">Company</p>
            <a href="#" className="block">
              About
            </a>
            <a href="#" className="block">
              FAQ
            </a>
            <a href="#" className="block">
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
