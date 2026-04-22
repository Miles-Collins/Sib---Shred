"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Meal } from "./types";
import { MealCard } from "./MealCard";

type FeaturedMealsCarouselProps = {
  meals: Meal[];
  allMeals?: Meal[];
};

const seededRandom = (seed: number) => {
  let value = Math.floor(seed * 2147483647) || 1;

  return () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };
};

const shuffledBySeed = (source: Meal[], seed: number) => {
  const random = seededRandom(seed);
  const copy = [...source];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy;
};

export function FeaturedMealsCarousel({ meals, allMeals = [] }: FeaturedMealsCarouselProps) {
  const topScrollerRef = useRef<HTMLDivElement | null>(null);
  const bottomScrollerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const [clientSeed, setClientSeed] = useState<number | null>(null);

  const hashValue = (value: string) => {
    let hash = 0;

    for (let i = 0; i < value.length; i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  };

  const getTopStep = (scroller: HTMLDivElement) => Math.max(260, Math.floor(scroller.clientWidth * 0.68));

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      // Client-only seed so each hard refresh gets a fresh order without hydration mismatch.
      setClientSeed(Math.random());
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const shuffledMeals = useMemo(() => {
    if (clientSeed !== null) {
      return shuffledBySeed(meals, clientSeed);
    }

    // Deterministic fallback for initial render; replaced on mount with client-seeded order.
    const copy = [...meals];
    copy.sort((a, b) => {
      const aScore = hashValue(`${a.slug}-${a.tag}`) % 997;
      const bScore = hashValue(`${b.slug}-${b.tag}`) % 997;
      return aScore - bScore;
    });

    return copy;
  }, [clientSeed, meals]);

  const orderedMeals = shuffledMeals.length > 0 ? shuffledMeals : [];
  const shuffledAllMeals = useMemo(() => {
    const source = allMeals.length > 0 ? allMeals : orderedMeals;

    if (clientSeed !== null) {
      return shuffledBySeed(source, Math.max(0.000001, 1 - clientSeed));
    }

    return source;
  }, [allMeals, clientSeed, orderedMeals]);

  const topMeals = orderedMeals;
  const bottomMeals = shuffledAllMeals.length > 1
    ? shuffledAllMeals
    : orderedMeals.length > 1
      ? orderedMeals.slice().reverse()
      : orderedMeals;

  const fallbackTopMeals = topMeals;
  const fallbackBottomMeals = bottomMeals;

  const topTrack = [...fallbackTopMeals, ...fallbackTopMeals];
  const bottomTrack = [...fallbackBottomMeals, ...fallbackBottomMeals];
  const dotCount = Math.min(6, Math.max(1, fallbackTopMeals.length));

  const scrollTrackByAmount = (
    target: "top" | "bottom",
    direction: -1 | 1,
    amount = 320,
  ) => {
    const scroller = target === "top" ? topScrollerRef.current : bottomScrollerRef.current;

    if (!scroller) {
      return;
    }

    const inferredAmount =
      target === "top"
        ? getTopStep(scroller)
        : amount;

    scroller.scrollBy({ left: direction * inferredAmount, behavior: "smooth" });
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

      const topScroller = topScrollerRef.current;
      const bottomScroller = bottomScrollerRef.current;

      if (!topScroller || !bottomScroller) {
        return;
      }

      const topHalfway = topScroller.scrollWidth / 2;
      const bottomHalfway = bottomScroller.scrollWidth / 2;

      if (topScroller.scrollLeft >= topHalfway) {
        topScroller.scrollLeft = 0;
      }

      if (bottomScroller.scrollLeft <= 0) {
        bottomScroller.scrollLeft = Math.max(0, bottomHalfway - bottomScroller.clientWidth);
      }

      topScroller.scrollBy({ left: getTopStep(topScroller), behavior: "smooth" });
      bottomScroller.scrollBy({ left: -260, behavior: "smooth" });
    }, 6500);

    return () => {
      window.clearInterval(tick);
    };
  }, [isPaused]);

  useEffect(() => {
    const topScroller = topScrollerRef.current;
    const bottomScroller = bottomScrollerRef.current;

    if (!topScroller || !bottomScroller) {
      return;
    }

    window.requestAnimationFrame(() => {
      const topLoopWidth = topScroller.scrollWidth / 2;
      const topStart = topLoopWidth + getTopStep(topScroller);

      // Start on the second logical tile so a tile is visible on both sides.
      topScroller.scrollLeft = Math.min(topStart, Math.max(0, topScroller.scrollWidth - topScroller.clientWidth));
      bottomScroller.scrollLeft = Math.max(0, bottomScroller.scrollWidth / 2 - bottomScroller.clientWidth);
    });
  }, [shuffledMeals]);

  useEffect(() => {
    const topScroller = topScrollerRef.current;

    if (!topScroller) {
      return;
    }

    const onScroll = () => {
      const loopWidth = topScroller.scrollWidth / 2;
      if (loopWidth <= 0) {
        return;
      }

      const normalized = ((topScroller.scrollLeft % loopWidth) + loopWidth) % loopWidth;
      const nextActive = Math.floor((normalized / loopWidth) * dotCount) % dotCount;
      setActiveDot(nextActive);
    };

    topScroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      topScroller.removeEventListener("scroll", onScroll);
    };
  }, [dotCount, shuffledMeals]);

  const jumpToDot = (index: number) => {
    const topScroller = topScrollerRef.current;
    const bottomScroller = bottomScrollerRef.current;

    if (!topScroller || !bottomScroller) {
      return;
    }

    const topLoopWidth = topScroller.scrollWidth / 2;
    const bottomLoopWidth = bottomScroller.scrollWidth / 2;
    const topTarget = (index / dotCount) * topLoopWidth;
    const bottomTarget = Math.max(0, bottomLoopWidth - (index / dotCount) * bottomLoopWidth);

    topScroller.scrollTo({ left: topTarget, behavior: "smooth" });
    bottomScroller.scrollTo({ left: bottomTarget, behavior: "smooth" });
  };

  return (
    <div
      className="no-hover-carousel relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mb-4 flex items-center justify-end gap-2 md:hidden">
        <button
          type="button"
          onClick={() => {
            scrollTrackByAmount("top", -1);
            scrollTrackByAmount("bottom", 1, 260);
          }}
          className="brand-control rounded-full border border-(--line) bg-(--paper) px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-(--ink)"
          aria-label="Scroll featured meals left"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => {
            scrollTrackByAmount("top", 1);
            scrollTrackByAmount("bottom", -1, 260);
          }}
          className="brand-control rounded-full border border-(--line) bg-(--paper) px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-(--ink)"
          aria-label="Scroll featured meals right"
        >
          Next
        </button>
      </div>

      <div
        ref={topScrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {topTrack.map((meal, index) => (
          <div
            key={`top-${meal.slug}-${index}`}
            className="w-[81vw] flex-none snap-center sm:w-[77vw] lg:w-[73vw] xl:w-[68vw]"
          >
            <MealCard
              meal={meal}
              delayMs={index * 90}
              variant="hero"
            />
          </div>
        ))}
      </div>

      <div
        ref={bottomScrollerRef}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {bottomTrack.map((meal, index) => (
          <article
            key={`bottom-${meal.slug}-${index}`}
            className="group w-[72vw] flex-none snap-start border border-(--line) bg-[#F5E6D3] p-3 sm:w-[255px]"
          >
            <Link href={`/menu/${meal.slug}`} className="block">
              <div className="relative h-34 overflow-hidden border border-(--line)">
                <Image
                  src={meal.image}
                  alt={meal.name}
                  fill
                  sizes="(max-width: 640px) 72vw, 255px"
                  className="object-cover transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="mt-3 flex items-center justify-between gap-3">
              <h3 className="truncate text-sm font-semibold text-(--ink)">{meal.name}</h3>
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-(--muted)">{meal.tag}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-3 hidden items-center justify-center gap-2 md:flex">
        {Array.from({ length: dotCount }).map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            aria-label={`Go to carousel page ${index + 1}`}
            onClick={() => jumpToDot(index)}
            className={`h-1.5 w-1.5 border transition-all ${
              activeDot === index ? "w-4 bg-[#1f3a40] border-[#1f3a40]" : "bg-[#95abb3] border-[#95abb3]"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between md:hidden">
        <button
          type="button"
          onClick={() => {
            scrollTrackByAmount("top", -1);
            scrollTrackByAmount("bottom", 1, 260);
          }}
          className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)"
          aria-label="Scroll featured meals left"
        >
          Scroll back
        </button>
        <button
          type="button"
          onClick={() => {
            scrollTrackByAmount("top", 1);
            scrollTrackByAmount("bottom", -1, 260);
          }}
          className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)"
          aria-label="Scroll featured meals right"
        >
          Scroll forward
        </button>
      </div>
    </div>
  );
}
