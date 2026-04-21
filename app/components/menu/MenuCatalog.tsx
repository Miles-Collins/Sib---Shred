"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Meal } from "../landing/types";

type MenuCatalogProps = {
  meals: Meal[];
};

const FILTERS = ["GF", "VEGAN", "SPICY", "HIGH PROTEIN"] as const;
const MENU_STATE_KEY = "sib-method-menu-state-v1";
const MENU_SCROLL_KEY = "sib-method-menu-scroll-v1";
const MENU_CARD_DESCRIPTION_LIMIT = 150;

const TAG_META: Record<
  string,
  { icon: string }
> = {
  GF: {
    icon: "/labels/gf-badge.svg",
  },
  VEGAN: {
    icon: "/labels/vegan-badge.svg",
  },
  SPICY: {
    icon: "/labels/spicy-badge.svg",
  },
  "HIGH PROTEIN": {
    icon: "/labels/protein-badge.svg",
  },
};

function parseMoney(price: string) {
  return Number.parseFloat(price.replace("$", ""));
}

function truncateWithEllipsis(text: string, limit: number) {
  const normalized = text.trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit).trimEnd()}...`;
}

export function MenuCatalog({ meals }: MenuCatalogProps) {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price" | "calories">("popular");
  const [hoveredMealSlug, setHoveredMealSlug] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showRestoredChip, setShowRestoredChip] = useState(false);
  const restoredScrollRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let restoredFromSession = false;

    try {
      const raw = window.sessionStorage.getItem(MENU_STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          activeFilters?: string[];
          search?: string;
          sortBy?: "popular" | "price" | "calories";
        };

        if (Array.isArray(parsed.activeFilters)) {
          if (parsed.activeFilters.length > 0) {
            restoredFromSession = true;
          }
          setActiveFilters(
            parsed.activeFilters.filter((item) =>
              FILTERS.includes(item as (typeof FILTERS)[number]),
            ),
          );
        }

        if (typeof parsed.search === "string") {
          if (parsed.search.trim().length > 0) {
            restoredFromSession = true;
          }
          setSearch(parsed.search);
        }

        if (
          parsed.sortBy === "popular" ||
          parsed.sortBy === "price" ||
          parsed.sortBy === "calories"
        ) {
          if (parsed.sortBy !== "popular") {
            restoredFromSession = true;
          }
          setSortBy(parsed.sortBy);
        }
      }
    } catch {
      // Ignore invalid persisted state.
    } finally {
      if (restoredFromSession) {
        setShowRestoredChip(true);
      }
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!showRestoredChip) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowRestoredChip(false);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showRestoredChip]);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      MENU_STATE_KEY,
      JSON.stringify({ activeFilters, search, sortBy }),
    );
  }, [activeFilters, hasHydrated, search, sortBy]);

  useEffect(() => {
    if (typeof window === "undefined" || restoredScrollRef.current) {
      return;
    }

    const rawScroll = window.sessionStorage.getItem(MENU_SCROLL_KEY);
    const scrollY = rawScroll ? Number.parseInt(rawScroll, 10) : NaN;

    if (Number.isFinite(scrollY) && scrollY > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: "auto" });
        });
      });
    }

    restoredScrollRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persistScroll = () => {
      window.sessionStorage.setItem(MENU_SCROLL_KEY, String(Math.round(window.scrollY)));
    };

    window.addEventListener("pagehide", persistScroll);
    window.addEventListener("beforeunload", persistScroll);

    return () => {
      window.removeEventListener("pagehide", persistScroll);
      window.removeEventListener("beforeunload", persistScroll);
    };
  }, []);

  const toggleFilter = (filter: string) => {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    );
  };

  const filteredMeals = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    let result = meals.filter((meal) => {
      const matchesSearch =
        !searchTerm ||
        meal.name.toLowerCase().includes(searchTerm) ||
        meal.description.toLowerCase().includes(searchTerm);

      const matchesFilters = activeFilters.every((filter) =>
        meal.dietaryTags.includes(filter),
      );

      return matchesSearch && matchesFilters;
    });

    if (sortBy === "price") {
      result = [...result].sort((a, b) => parseMoney(a.price) - parseMoney(b.price));
    }

    if (sortBy === "calories") {
      result = [...result].sort((a, b) => a.calories - b.calories);
    }

    return result;
  }, [activeFilters, meals, search, sortBy]);

  const preserveMenuStateForDetail = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      MENU_STATE_KEY,
      JSON.stringify({ activeFilters, search, sortBy }),
    );
    window.sessionStorage.setItem(MENU_SCROLL_KEY, String(Math.round(window.scrollY)));
  };

  const goToMealDetail = (slug: string) => {
    preserveMenuStateForDetail();
    router.push(`/menu/${slug}`);
  };

  return (
    <div className="space-y-7">
      {showRestoredChip ? (
        <div className="inline-flex items-center rounded-full border border-(--line) bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-(--muted) shadow-[0_6px_16px_rgba(16,27,23,0.06)]">
          Restored your last menu view
        </div>
      ) : null}

      <section className="tablet-menu-controls motion-sticky rounded-2xl border border-(--line) bg-white/92 p-3 shadow-[0_10px_26px_rgba(16,27,23,0.06)] sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            {FILTERS.map((filter) => {
              const active = activeFilters.includes(filter);
              const meta = TAG_META[filter];

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => toggleFilter(filter)}
                  className={`brand-chip inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase ${
                    active
                      ? "border-(--ink) bg-(--ink) text-white shadow-[0_8px_18px_rgba(16,27,23,0.14)] translate-y-px"
                      : "border-(--line) bg-white text-(--ink) shadow-[0_4px_10px_rgba(16,27,23,0.04)]"
                  }`}
                >
                  <Image
                    src={meta.icon}
                    alt={filter}
                    width={20}
                    height={20}
                    className="motion-badge h-5 w-5"
                  />
                  {filter}
                </button>
              );
            })}

            {activeFilters.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveFilters([])}
                className="brand-control ml-1 rounded-full border border-(--line) bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-(--muted) underline"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search meals"
              className="brand-control w-full rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) placeholder:text-(--muted) focus:ring-2 md:min-h-12"
            />
            <select
              aria-label="Sort meals"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "popular" | "price" | "calories")
              }
              className="brand-control w-full rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2 sm:w-auto md:min-h-12"
            >
              <option value="popular">Sort: Popular</option>
              <option value="price">Sort: Price</option>
              <option value="calories">Sort: Calories</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredMeals.map((meal, index) => {
          const isHovering = hoveredMealSlug === meal.slug;
          
          const addMealToCart = () => {
            const cart = JSON.parse(localStorage.getItem("sib-method-cart") || "[]");
            const existing = cart.find((item: { slug: string }) => item.slug === meal.slug);
            
            if (existing) {
              existing.qty += 1;
            } else {
              cart.push({
                slug: meal.slug,
                name: meal.name,
                price: meal.price,
                image: meal.image,
                qty: 1,
              });
            }
            
            localStorage.setItem("sib-method-cart", JSON.stringify(cart));
            window.dispatchEvent(new Event("sib-method-cart-updated"));
          };

          return (
          <article
            key={meal.slug}
            className={`motion-stagger stagger-delay-${Math.min(index, 8)} cursor-pointer overflow-hidden rounded-[1.4rem] bg-white/75 backdrop-blur-sm`}
            onMouseEnter={() => setHoveredMealSlug(meal.slug)}
            onMouseLeave={() => setHoveredMealSlug((current) => (current === meal.slug ? null : current))}
            onClick={() => goToMealDetail(meal.slug)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToMealDetail(meal.slug);
              }
            }}
            role="link"
            tabIndex={0}
            aria-label={`View ${meal.name}`}
          >
            <div className="relative overflow-hidden rounded-t-[1.4rem]">
              <Image
                src={meal.image}
                alt={meal.name}
                width={900}
                height={560}
                className="motion-card-image h-52 w-full object-cover transition-transform duration-300"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  addMealToCart();
                }}
                className="absolute bottom-2 right-0 rounded-l-full rounded-r-none border border-(--line) bg-white/90 px-3.5 py-1.5 text-sm font-semibold leading-none text-(--ink) shadow-[0_3px_8px_rgba(16,27,23,0.14)] backdrop-blur-sm transition-colors hover:bg-white"
              >
                Add to cart
              </button>
            </div>

            <div className="space-y-2 p-4">
              <div className="flex flex-wrap gap-2">
                {meal.dietaryTags.map((tag) => (
                  <div key={tag} className="inline-flex items-center" title={tag}>
                    <Image
                      src={TAG_META[tag]?.icon ?? "/labels/gf-badge.svg"}
                      alt={tag}
                      width={24}
                      height={24}
                      className="motion-badge h-6 w-6"
                    />
                  </div>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-(--muted)" title={meal.description}>
                {truncateWithEllipsis(meal.description, MENU_CARD_DESCRIPTION_LIMIT)}
              </p>

              <div className="flex items-center text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">
                <span>Macros</span>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isHovering ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-(--muted)">
                  <span className="rounded-full bg-(--bg-cream) px-2 py-0.5">{meal.protein} protein</span>
                  <span className="rounded-full bg-(--bg-cream) px-2 py-0.5">{meal.carbs} carbs</span>
                  <span className="rounded-full bg-(--bg-cream) px-2 py-0.5">{meal.fat} fat</span>
                  <span className="rounded-full bg-(--bg-cream) px-2 py-0.5">{meal.calories} cal</span>
                </div>
              </div>
            </div>
          </article>
        );
        })}
      </section>

      {!filteredMeals.length ? (
        <div className="rounded-xl border border-(--line) bg-white p-6 text-center text-(--muted)">
          No meals match these filters. Try clearing one filter.
        </div>
      ) : null}
    </div>
  );
}
