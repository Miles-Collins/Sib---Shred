import Image from "next/image";
import Link from "next/link";

import type { Meal } from "./types";

type MealCardProps = {
  meal: Meal;
  delayMs?: number;
};

export function MealCard({ meal, delayMs = 0 }: MealCardProps) {
  const staggerDelayClass = `stagger-delay-${Math.min(8, Math.max(0, Math.round(delayMs / 70)))}`;

  return (
    <article
      className={`brand-card-hover motion-lift motion-stagger ${staggerDelayClass} group overflow-hidden rounded-2xl border border-(--line) bg-white p-5`}
    >
      <Link href={`/menu/${meal.slug}`}>
        <Image
          src={meal.image}
          alt={meal.name}
          width={600}
          height={380}
          className="motion-card-image h-50 w-full rounded-xl border border-(--line) object-cover sm:h-48"
        />
      </Link>
      <p className="mt-4 inline-block rounded-full bg-(--berry) px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">
        {meal.tag}
      </p>
      <h3 className="mt-3 text-lg font-extrabold leading-tight sm:text-xl">
        <Link href={`/menu/${meal.slug}`}>{meal.name}</Link>
      </h3>
      <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-(--muted) uppercase">
        Nutrition
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold sm:text-xs">
        <span className="rounded-full bg-(--bg-cream) px-3 py-1">{meal.calories} cal</span>
        <span className="rounded-full bg-(--bg-cream) px-3 py-1">{meal.protein} protein</span>
        <span className="rounded-full bg-(--bg-cream) px-3 py-1">{meal.carbs} carbs</span>
        <span className="rounded-full bg-(--bg-cream) px-3 py-1">{meal.fat} fat</span>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-lg font-black sm:text-xl">{meal.price}</p>
        <Link
          href={`/menu/${meal.slug}`}
          className="brand-control rounded-full bg-(--ink) px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          View Meal
        </Link>
      </div>
    </article>
  );
}
