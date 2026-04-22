"use client";

import Image from "next/image";
import Link from "next/link";

import type { Meal } from "./types";

type MealCardProps = {
  meal: Meal;
  delayMs?: number;
  variant?: "default" | "hero";
};

export function MealCard({ meal, delayMs = 0, variant = "default" }: MealCardProps) {
  const staggerDelayClass = `stagger-delay-${Math.min(8, Math.max(0, Math.round(delayMs / 70)))}`;
  const isHero = variant === "hero";

  if (isHero) {
    return (
      <article
        className={`brand-card-hover motion-lift motion-stagger ${staggerDelayClass} group relative overflow-hidden border border-(--line) bg-black`}
      >
        <Link href={`/menu/${meal.slug}`} className="block">
          <div className="relative h-[58vw] min-h-[320px] max-h-[620px] w-full">
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 78vw"
              className="motion-card-image object-cover transition-transform duration-500"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.28)_58%,rgba(0,0,0,0.78)_100%)]" />
          </div>
        </Link>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">Featured Drop</p>
          <h3 className="mt-2 max-w-[22ch] text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
            {meal.name}
          </h3>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/menu/${meal.slug}`}
              className="inline-flex min-h-10 items-center justify-center border border-white bg-white px-5 py-2 text-sm font-semibold text-black"
            >
              View Meal
            </Link>
            <span className="text-sm font-medium text-white/88">{meal.tag} · {meal.price}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`brand-card-hover motion-lift motion-stagger ${staggerDelayClass} group overflow-hidden border border-[#e4cfb0] bg-[#F5E6D3] ${
        isHero ? "p-6" : "p-5"
      }`}
    >
      <div className="relative overflow-hidden">
        <Link href={`/menu/${meal.slug}`}>
          <Image
            src={meal.image}
            alt={meal.name}
            width={600}
            height={380}
            className={`motion-card-image w-full border border-(--line) object-cover transition-transform duration-300 ${
              isHero ? "h-60 sm:h-72" : "h-50 sm:h-48"
            }`}
          />
        </Link>
      </div>

      <h3 className={`mt-3 font-semibold leading-tight text-(--ink) ${isHero ? "text-[1.08rem]" : "text-[0.95rem]"}`}>
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
