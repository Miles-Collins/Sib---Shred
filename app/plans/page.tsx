import Link from "next/link";

import { plans } from "../components/landing/data";

export default function PlansPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Subscribe and save
        </p>
        <h1 className="mt-1 text-4xl font-black tracking-tight">Plan options</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Simple weekly plans for one person who wants fresh meals without a
          kitchen full of leftovers.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
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
              Choose plan
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
