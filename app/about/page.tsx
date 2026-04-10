import Link from "next/link";

import { Header } from "../components/landing/Header";

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <section className="brand-shell grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[linear-gradient(180deg,#f9f8f1,#eef4e8)] p-6 shadow-[var(--shadow-card)]">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              <div className="flex h-44 w-44 items-center justify-center rounded-full border border-[rgba(16,27,23,0.08)] bg-white shadow-[0_18px_40px_rgba(16,27,23,0.1)]">
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#dfeccb_0%,#8bbf5c_60%,#2f7a4c_100%)] text-4xl font-black text-white">
                  A
                </div>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                Solo founder
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                Built, cooked, packaged, and delivered by Alysha.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                This is a small, hands-on kitchen, not a big operation hiding behind a generic storefront.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              About me
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              One kitchen, one set of recipes, Alysha behind every box.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              Sibshred Kitchen is Alysha&apos;s solo-run meal prep service built around fresh food,
              clear macros, and a simple ordering flow. She cooks, portions, and packages each
              meal herself so the experience stays personal from the first click to delivery.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  What Alysha values
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  Fresh cooking, honest nutrition, and a smooth customer experience.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Best for
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  Anyone who wants real meals ready in minutes without living in the kitchen.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="my-story" className="brand-shell grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="brand-kicker text-[var(--muted)]">My story</p>
            <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
              Alysha wanted healthy food to feel simple, personal, and worth repeating.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              Sibshred started from the idea that meal prep should taste like something you would
              actually look forward to opening in the fridge. Alysha keeps the menu focused, uses
              ingredients she would serve to people she cares about, and builds every box with the
              same attention she would want for her own meals.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              The goal is not to feel like a giant chain. It is to feel like a thoughtful kitchen you
              can trust every week. Alysha keeps the ordering straightforward, the ingredients clear,
              and the meals balanced so you can eat well without extra work.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="brand-kicker text-[var(--berry)]">What to expect</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                A small-batch menu, direct communication, and meals that are packed with care.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="brand-kicker text-[var(--berry)]">My promise</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                If it goes out under Alysha&apos;s name, it has to taste good, look good, and make sense for your week.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-panel p-6 sm:p-8">
          <p className="brand-kicker text-[var(--muted)]">How it works</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "Pick your meals from the weekly menu",
              "Alysha preps, portions, and packages everything fresh",
              "You heat, eat, and get your time back",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--line)] bg-white p-5"
              >
                <p className="brand-kicker text-[var(--berry)]">Step {index + 1}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="brand-shell grid gap-4 p-6 sm:p-8 md:grid-cols-3">
          {[
            {
              label: "Kitchen style",
              text: "Small-batch cooking with a focus on consistency and freshness.",
            },
            {
              label: "Voice",
              text: "Direct, personal, and built around a one-person relationship.",
            },
            {
              label: "Experience",
              text: "Simple ordering, clear labels, and meals that are ready when you need them.",
            },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="brand-kicker text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-[var(--mint)]/45 p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Get in touch
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Want to talk about an order or a custom plan?
              </h2>
            </div>
            <Link
              href="/checkout"
              className="brand-control rounded-full bg-[var(--ink)] px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.1em] text-white"
            >
              Start an order
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}