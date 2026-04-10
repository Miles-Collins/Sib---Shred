import Link from "next/link";

import { Header } from "../components/landing/Header";

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <header className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            About me
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            One kitchen, one set of recipes, one person behind every box.
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Sibshred Kitchen is a solo-run meal prep service built around fresh
            food, clear macros, and a simple ordering flow. I cook, portion, and
            package each meal myself so the experience stays personal from the
            first click to delivery.
          </p>
        </header>

        <section className="brand-shell grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="brand-kicker text-[var(--muted)]">My approach</p>
            <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
              I keep the menu focused, seasonal, and realistic to prep well.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              The goal is not to feel like a giant chain. It is to feel like a
              thoughtful kitchen you can trust every week. I keep the ordering
              straightforward, the ingredients clear, and the meals balanced so
              you can eat well without extra work.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                What I value
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
        </section>

        <section className="brand-panel p-6 sm:p-8">
          <p className="brand-kicker text-[var(--muted)]">How it works</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "Pick your meals from the weekly menu",
              "I prep, portion, and package everything fresh",
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