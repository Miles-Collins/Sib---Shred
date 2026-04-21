"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Meal } from "./types";
import { AddToCartPanel } from "../product/AddToCartPanel";

type MealCardProps = {
  meal: Meal;
  delayMs?: number;
};

export function MealCard({ meal, delayMs = 0 }: MealCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const staggerDelayClass = `stagger-delay-${Math.min(8, Math.max(0, Math.round(delayMs / 70)))}`;

  return (
    <article
      className={`brand-card-hover motion-lift motion-stagger ${staggerDelayClass} group overflow-hidden rounded-2xl border border-(--line) bg-white p-5`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
            <button
              onClick={(e) => {
                e.preventDefault();
                const cart = document.querySelector(`[data-meal-slug="${meal.slug}"]`);
                if (cart) {
                  const addBtn = cart.querySelector('button[type="button"]');
                  if (addBtn instanceof HTMLButtonElement) addBtn.click();
                }
              }}
              className="brand-control rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Add to cart
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 inline-block rounded-full bg-(--berry) px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">
        {meal.tag}
      </p>
      <h3 className="mt-3 text-lg font-extrabold leading-tight sm:text-xl">
        <Link href={`/menu/${meal.slug}`}>{meal.name}</Link>
      </h3>
      {meal.subtitle && (
        <p className="mt-1 text-sm text-(--muted)">{meal.subtitle}</p>
      )}
      <p className="mt-3 text-sm font-semibold text-(--berry)">{meal.price}/serv</p>
      <p className="text-xs text-(--muted)">⏱ 15 min • {meal.calories} cal</p>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold sm:text-xs">
        <span className="rounded-full bg-(--bg-cream) px-3 py-1">{meal.protein}</span>
        <span className="rounded-full bg-(--bg-cream) px-3 py-1">{meal.carbs}</span>
        <span className="rounded-full bg-(--bg-cream) px-3 py-1">{meal.fat}</span>
      </div>

      <div className="mt-6" data-meal-slug={meal.slug}>
        <Link
          href={`/menu/${meal.slug}`}
          className="brand-control inline-block w-full rounded-full bg-(--ink) px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          View Meal
        </Link>
      </div>
    </article>
  );
}
