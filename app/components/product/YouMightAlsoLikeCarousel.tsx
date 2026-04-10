"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Meal } from "../landing/types";

type YouMightAlsoLikeCarouselProps = {
  currentMealSlug: string;
  meals: Meal[];
};

export function YouMightAlsoLikeCarousel({
  currentMealSlug,
  meals,
}: YouMightAlsoLikeCarouselProps) {
  const suggestions = useMemo(
    () => meals.filter((meal) => meal.slug !== currentMealSlug),
    [currentMealSlug, meals],
  );

  const [startIndex, setStartIndex] = useState(0);
  const maxStart = Math.max(0, suggestions.length - 1);

  const movePrev = () => setStartIndex((current) => Math.max(0, current - 1));
  const moveNext = () =>
    setStartIndex((current) => Math.min(maxStart, current + 1));

  if (!suggestions.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-medium tracking-tight">You might also like</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={movePrev}
            disabled={startIndex === 0}
            className="rounded-md border border-[var(--line)] bg-white px-3 py-1.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={moveNext}
            disabled={startIndex === maxStart}
            className="rounded-md border border-[var(--line)] bg-white px-3 py-1.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${startIndex * 320}px)` }}
        >
          {suggestions.map((meal) => (
            <Link
              key={meal.slug}
              href={`/menu/${meal.slug}`}
              className="min-w-[320px] border-r border-[var(--line)] p-3"
            >
              <Image
                src={meal.image}
                alt={meal.name}
                width={480}
                height={300}
                className="h-44 w-full rounded-lg object-cover"
              />
              <h3 className="mt-3 text-lg font-extrabold leading-tight">{meal.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
