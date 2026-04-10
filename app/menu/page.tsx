import Image from "next/image";
import Link from "next/link";

import { featuredMeals } from "../components/landing/data";

export default function MenuPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Weekly menu
          </p>
          <h1 className="mt-1 text-4xl font-black tracking-tight">Browse meals</h1>
        </div>
        <Link
          href="/checkout"
          className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white"
        >
          Continue to checkout
        </Link>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {featuredMeals.map((meal) => (
          <article
            key={meal.name}
            className="rounded-2xl border border-[var(--line)] bg-white p-5"
          >
            <Link href={`/menu/${meal.slug}`}>
              <Image
                src={meal.image}
                alt={meal.name}
                width={600}
                height={380}
                className="h-42 w-full rounded-xl border border-[var(--line)] object-cover"
              />
            </Link>
            <h2 className="mt-4 text-xl font-extrabold">
              <Link href={`/menu/${meal.slug}`}>{meal.name}</Link>
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {meal.calories} cal · {meal.protein} protein · {meal.carbs} carbs
            </p>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-lg font-black">{meal.price}</p>
              <Link
                href={`/menu/${meal.slug}`}
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-bold uppercase text-white"
              >
                View
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
