import Image from "next/image";
import Link from "next/link";

import type { Meal } from "./types";

type MealCardProps = {
  meal: Meal;
};

export function MealCard({ meal }: MealCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--line)] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
      <Link href={`/menu/${meal.slug}`}>
        <Image
          src={meal.image}
          alt={meal.name}
          width={600}
          height={380}
          className="h-42 w-full rounded-xl border border-[var(--line)] object-cover"
        />
      </Link>
      <p className="mt-4 inline-block rounded-full bg-[var(--berry)] px-3 py-1 text-xs font-bold tracking-[0.12em] text-white uppercase">
        {meal.tag}
      </p>
      <h3 className="mt-3 text-xl font-extrabold leading-tight">
        <Link href={`/menu/${meal.slug}`}>{meal.name}</Link>
      </h3>
      <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
        Nutrition
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-[var(--bg-cream)] px-3 py-1">{meal.calories} cal</span>
        <span className="rounded-full bg-[var(--bg-cream)] px-3 py-1">{meal.protein} protein</span>
        <span className="rounded-full bg-[var(--bg-cream)] px-3 py-1">{meal.carbs} carbs</span>
        <span className="rounded-full bg-[var(--bg-cream)] px-3 py-1">{meal.fat} fat</span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-black">{meal.price}</p>
        <Link
          href={`/menu/${meal.slug}`}
          className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          View Meal
        </Link>
      </div>
    </article>
  );
}
