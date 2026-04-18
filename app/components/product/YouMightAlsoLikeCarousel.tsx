"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [cardStep, setCardStep] = useState(332);
  const [visibleCards, setVisibleCards] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const maxStart = Math.max(0, suggestions.length - visibleCards);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }

      const firstCard = viewport.querySelector<HTMLElement>("[data-carousel-card='true']");
      if (!firstCard) {
        return;
      }

      const track = firstCard.parentElement;
      if (!track) {
        return;
      }

      const trackStyles = window.getComputedStyle(track);
      const gap =
        Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0") || 0;

      const measuredStep = firstCard.getBoundingClientRect().width + gap;
      const viewportWidth = viewport.getBoundingClientRect().width;
      const measuredVisibleCards = Math.max(1, Math.floor(viewportWidth / measuredStep));

      setCardStep(measuredStep);
      setVisibleCards(measuredVisibleCards);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [suggestions.length]);

  useEffect(() => {
    setStartIndex((current) => Math.min(current, maxStart));
  }, [maxStart]);

  const moveTo = (index: number) => {
    const clamped = Math.max(0, Math.min(maxStart, index));
    setStartIndex(clamped);

    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    viewport.scrollTo({ left: clamped * cardStep, behavior: "smooth" });
  };

  const movePrev = () => moveTo(startIndex - 1);
  const moveNext = () => moveTo(startIndex + 1);

  const getSwipeThreshold = () => {
    if (typeof window === "undefined") {
      return 44;
    }

    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1279px)").matches;
    return isTablet ? 68 : 44;
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX;
    if (typeof endX !== "number") {
      touchStartX.current = null;
      return;
    }

    const deltaX = touchStartX.current - endX;
    const threshold = getSwipeThreshold();

    if (deltaX > threshold) {
      moveNext();
    } else if (deltaX < -threshold) {
      movePrev();
    }

    touchStartX.current = null;
  };

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
            className="rounded-md border border-(--line) bg-white px-3 py-1.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={moveNext}
            disabled={startIndex === maxStart}
            className="rounded-md border border-(--line) bg-white px-3 py-1.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        onScroll={(event) => {
          const scrollLeft = event.currentTarget.scrollLeft;
          const inferredIndex = Math.round(scrollLeft / cardStep);
          setStartIndex(Math.max(0, Math.min(maxStart, inferredIndex)));
        }}
        className="overflow-x-auto rounded-xl border border-(--line) bg-white"
      >
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex gap-3 p-3"
        >
          {suggestions.map((meal) => (
            <Link
              key={meal.slug}
              data-carousel-card="true"
              href={`/menu/${meal.slug}`}
              className="shrink-0 snap-start min-w-[84%] rounded-xl border border-(--line) bg-white p-3 sm:min-w-[72%] md:min-w-[56%] lg:min-w-[44%] xl:min-w-[320px]"
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
