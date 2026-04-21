"use client";

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
      className={`brand-card-hover motion-lift motion-stagger ${staggerDelayClass} group overflow-hidden rounded-2xl border border-[#e4cfb0] bg-[#F5E6D3] p-5`}
    >
      <div className="relative overflow-hidden rounded-xl">
        <Link href={`/menu/${meal.slug}`}>
          <Image
            src={meal.image}
            alt={meal.name}
            width={600}
            height={380}
            className="motion-card-image h-50 w-full border border-(--line) object-cover transition-transform duration-300 sm:h-48"
          />
        </Link>
      </div>

      <h3 className="mt-3 text-[0.95rem] font-semibold leading-tight text-(--ink)">
        <Link href={`/menu/${meal.slug}`} className="block truncate">
          {meal.name}
        </Link>
      </h3>

      <div className="mt-6" data-meal-slug={meal.slug}>
        <Link
          href={`/menu/${meal.slug}`}
          className="brand-control inline-block w-full rounded-full bg-[#5FA8C7] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white"
        >
          View Meal
        </Link>
      </div>
    </article>
  );
}
