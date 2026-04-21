"use client";

import { useEffect, useRef, useState } from "react";

import type { Meal } from "./types";
import { MealCard } from "./MealCard";

type FeaturedMealsCarouselProps = {
  meals: Meal[];
};

export function FeaturedMealsCarousel({ meals }: FeaturedMealsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollByAmount = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const cardWidth = 320;
    scroller.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const tick = window.setInterval(() => {
      if (!mediaQuery.matches || isPaused) {
        return;
      }

      const scroller = scrollerRef.current;

      if (!scroller) {
        return;
      }

      const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8;

      if (atEnd) {
        scroller.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      scrollByAmount(1);
    }, 6500);

    return () => {
      window.clearInterval(tick);
    };
  }, [isPaused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-linear-to-r from-background to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-linear-to-l from-background to-transparent md:block" />

      <div className="mb-4 flex items-center justify-end gap-2 md:hidden">
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          className="brand-control rounded-full border border-(--line) bg-(--paper) px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-(--ink)"
          aria-label="Scroll featured meals left"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          className="brand-control rounded-full border border-(--line) bg-(--paper) px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-(--ink)"
          aria-label="Scroll featured meals right"
        >
          Next
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {meals.map((meal, index) => (
          <div
            key={meal.slug}
            className="w-[82vw] flex-none snap-start sm:w-[320px] xl:w-[calc((100%-3.75rem)/4)]"
          >
            <MealCard meal={meal} delayMs={index * 90} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between md:hidden">
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)"
          aria-label="Scroll featured meals left"
        >
          Scroll back
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)"
          aria-label="Scroll featured meals right"
        >
          Scroll forward
        </button>
      </div>
    </div>
  );
}
