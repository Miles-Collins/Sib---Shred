import "server-only";

import { prisma } from "@/lib/prisma";
import { featuredMeals, plans as fallbackPlans } from "@/app/components/landing/data";
import type { Meal, Plan } from "@/app/components/landing/types";

function centsToPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function toMeal(record: {
  slug: string;
  name: string;
  subtitle: string | null;
  description: string;
  priceCents: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  sodiumMg: number | null;
  allergens: string | null;
  facilityNote: string | null;
  imageUrl: string;
  tag: string;
  dietaryTags: string[];
  ingredients: string[];
  isGlutenFree: boolean;
}): Meal {
  return {
    slug: record.slug,
    name: record.name,
    subtitle: record.subtitle ?? undefined,
    description: record.description,
    allergens: record.allergens ?? "",
    facilityNote: record.facilityNote ?? "",
    dietaryTags: record.dietaryTags,
    calories: record.calories,
    protein: `${record.proteinGrams}g`,
    carbs: `${record.carbsGrams}g`,
    fat: `${record.fatGrams}g`,
    sodium: `${record.sodiumMg ?? 0}mg`,
    ingredients: record.ingredients,
    isGlutenFree: record.isGlutenFree,
    tag: record.tag,
    price: centsToPrice(record.priceCents),
    image: record.imageUrl,
  };
}

function toPlan(record: {
  slug: string;
  name: string;
  description: string | null;
  weeklyMeals: number;
  priceCents: number;
}): Plan {
  return {
    title: record.name,
    detail: record.description ?? `${record.weeklyMeals} meals / week`,
    price: centsToPrice(record.priceCents),
  };
}

function parseMeals(): Meal[] {
  return featuredMeals;
}

export async function getMealCatalog(): Promise<Meal[]> {
  const records = await prisma.meal.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (records.length === 0) {
    return parseMeals();
  }

  return records.map(toMeal);
}

export async function getMealBySlug(slug: string): Promise<Meal | null> {
  const record = await prisma.meal.findUnique({ where: { slug } });

  if (record) {
    return toMeal(record);
  }

  return featuredMeals.find((meal) => meal.slug === slug) ?? null;
}

export async function getPlanCatalog(): Promise<Plan[]> {
  const records = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (records.length === 0) {
    return fallbackPlans;
  }

  return records.map(toPlan);
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  const record = await prisma.plan.findUnique({ where: { slug } });

  if (record) {
    return toPlan(record);
  }

  return fallbackPlans.find((plan) => plan.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) ?? null;
}
