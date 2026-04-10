"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Meal } from "../landing/types";

type MenuCatalogProps = {
  meals: Meal[];
};

const FILTERS = ["GF", "VEGAN", "SPICY", "HIGH PROTEIN"] as const;

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

export function MenuCatalog({ meals }: MenuCatalogProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price" | "calories">("popular");

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

  return (
    <div className="space-y-7">
      <section className="sticky top-27 z-40 rounded-2xl border border-[var(--line)] bg-white/95 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => {
              const active = activeFilters.includes(filter);
              const meta = TAG_META[filter];

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => toggleFilter(filter)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase transition ${
                    active
                      ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                      : "border-[var(--line)] bg-white text-[var(--ink)]"
                  }`}
                >
                  <Image
                    src={meta.icon}
                    alt={filter}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  {filter}
                </button>
              );
            })}

            {activeFilters.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveFilters([])}
                className="ml-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)] underline"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search meals"
              className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[var(--sun)] placeholder:text-[var(--muted)] focus:ring-2"
            />
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "popular" | "price" | "calories")
              }
              className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[var(--sun)] focus:ring-2"
            >
              <option value="popular">Sort: Popular</option>
              <option value="price">Sort: Price</option>
              <option value="calories">Sort: Calories</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredMeals.map((meal) => (
          <article
            key={meal.slug}
            className="overflow-hidden rounded-xl border border-[var(--line)] bg-white"
          >
            <Link href={`/menu/${meal.slug}`}>
              <Image
                src={meal.image}
                alt={meal.name}
                width={900}
                height={560}
                className="h-52 w-full object-cover"
              />
            </Link>

            <div className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                {meal.dietaryTags.map((tag) => (
                  <div key={tag} className="inline-flex items-center" title={tag}>
                    <Image
                      src={TAG_META[tag]?.icon ?? "/labels/gf-badge.svg"}
                      alt={tag}
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-black tracking-tight leading-tight">
                <Link href={`/menu/${meal.slug}`}>{meal.name}</Link>
              </h2>

              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {meal.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm text-[var(--muted)]">
                <p>Calories: {meal.calories}</p>
                <p>Protein: {meal.protein}</p>
                <p>Carbs: {meal.carbs}</p>
                <p>Fat: {meal.fat}</p>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--line)] pt-3">
                <p className="text-3xl font-black text-[var(--berry)]">{meal.price}</p>
                <Link
                  href={`/menu/${meal.slug}`}
                  className="rounded-md bg-[var(--sun)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
                >
                  View Meal
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {!filteredMeals.length ? (
        <div className="rounded-xl border border-[var(--line)] bg-white p-6 text-center text-[var(--muted)]">
          No meals match these filters. Try clearing one filter.
        </div>
      ) : null}
    </div>
  );
}
