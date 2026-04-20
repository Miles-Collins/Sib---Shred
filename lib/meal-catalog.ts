import "server-only";

import { prisma } from "@/lib/prisma";
import { featuredMeals, plans as fallbackPlans } from "@/app/components/landing/data";
import type { Meal, Plan } from "@/app/components/landing/types";
import { getMealsFromSanity } from "@/sanity/lib/queries";

function canQueryDatabase() {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_URL);
}

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
  const sanityMeals = await getMealsFromSanity();
  if (sanityMeals.length > 0) {
    return sanityMeals.map((meal) => ({
      slug: meal.slug,
      name: meal.name,
      subtitle: meal.subtitle ?? undefined,
      description: meal.description,
      allergens: meal.allergens ?? "",
      facilityNote: meal.facilityNote ?? "",
      dietaryTags: Array.isArray(meal.dietaryTags) ? meal.dietaryTags : [],
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      sodium: meal.sodium ?? "0mg",
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      isGlutenFree: Boolean(meal.isGlutenFree),
      tag: meal.tag,
      price: meal.price,
      image: meal.imageUrl ?? "/meal-chipotle.svg",
    }));
  }

  if (!canQueryDatabase()) {
    return parseMeals();
  }

  let records: Awaited<ReturnType<typeof prisma.meal.findMany>> = [];

  try {
    records = await prisma.meal.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return parseMeals();
  }

  if (records.length === 0) {
    return parseMeals();
  }

  return records.map(toMeal);
}

export async function getMealBySlug(slug: string): Promise<Meal | null> {
  const sanityMeals = await getMealsFromSanity();
  if (sanityMeals.length > 0) {
    const meal = sanityMeals.find((item) => item.slug === slug);
    if (meal) {
      return {
        slug: meal.slug,
        name: meal.name,
        subtitle: meal.subtitle ?? undefined,
        description: meal.description,
        allergens: meal.allergens ?? "",
        facilityNote: meal.facilityNote ?? "",
        dietaryTags: Array.isArray(meal.dietaryTags) ? meal.dietaryTags : [],
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        sodium: meal.sodium ?? "0mg",
        ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
        isGlutenFree: Boolean(meal.isGlutenFree),
        tag: meal.tag,
        price: meal.price,
        image: meal.imageUrl ?? "/meal-chipotle.svg",
      };
    }
  }

  if (!canQueryDatabase()) {
    return featuredMeals.find((meal) => meal.slug === slug) ?? null;
  }

  let record: Awaited<ReturnType<typeof prisma.meal.findUnique>> = null;

  try {
    record = await prisma.meal.findUnique({ where: { slug } });
  } catch {
    return featuredMeals.find((meal) => meal.slug === slug) ?? null;
  }

  if (record) {
    return toMeal(record);
  }

  return featuredMeals.find((meal) => meal.slug === slug) ?? null;
}

export async function getPlanCatalog(): Promise<Plan[]> {
  if (!canQueryDatabase()) {
    return fallbackPlans;
  }

  let records: Awaited<ReturnType<typeof prisma.plan.findMany>> = [];

  try {
    records = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return fallbackPlans;
  }

  if (records.length === 0) {
    return fallbackPlans;
  }

  return records.map(toPlan);
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  if (!canQueryDatabase()) {
    return fallbackPlans.find((plan) => plan.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) ?? null;
  }

  let record: Awaited<ReturnType<typeof prisma.plan.findUnique>> = null;

  try {
    record = await prisma.plan.findUnique({ where: { slug } });
  } catch {
    return fallbackPlans.find((plan) => plan.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) ?? null;
  }

  if (record) {
    return toPlan(record);
  }

  return fallbackPlans.find((plan) => plan.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) ?? null;
}
