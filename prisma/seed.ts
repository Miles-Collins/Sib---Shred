import "dotenv/config";

import { prisma } from "../lib/prisma";
import { featuredMeals, plans } from "../app/components/landing/data";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function priceToCents(price: string) {
  return Math.round(Number.parseFloat(price.replace(/[^0-9.]/g, "")) * 100);
}

function ownerEmailsFromEnv() {
  return (process.env.ADMIN_OWNER_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: slugify(plan.title) },
      update: {
        name: plan.title,
        description: plan.detail,
        weeklyMeals: Number.parseInt(plan.detail, 10),
        priceCents: priceToCents(plan.price),
        isActive: true,
      },
      create: {
        slug: slugify(plan.title),
        name: plan.title,
        description: plan.detail,
        weeklyMeals: Number.parseInt(plan.detail, 10),
        priceCents: priceToCents(plan.price),
        isActive: true,
      },
    });
  }

  for (const meal of featuredMeals) {
    await prisma.meal.upsert({
      where: { slug: meal.slug },
      update: {
        name: meal.name,
        subtitle: meal.subtitle ?? null,
        description: meal.description,
        priceCents: priceToCents(meal.price),
        calories: meal.calories,
        proteinGrams: Number.parseInt(meal.protein, 10) || 0,
        carbsGrams: Number.parseInt(meal.carbs, 10) || 0,
        fatGrams: Number.parseInt(meal.fat, 10) || 0,
        sodiumMg: Number.parseInt(meal.sodium, 10) || null,
        allergens: meal.allergens || null,
        facilityNote: meal.facilityNote || null,
        imageUrl: meal.image,
        tag: meal.tag,
        dietaryTags: meal.dietaryTags,
        ingredients: meal.ingredients,
        isGlutenFree: meal.isGlutenFree,
        isActive: true,
      },
      create: {
        slug: meal.slug,
        name: meal.name,
        subtitle: meal.subtitle ?? null,
        description: meal.description,
        priceCents: priceToCents(meal.price),
        calories: meal.calories,
        proteinGrams: Number.parseInt(meal.protein, 10) || 0,
        carbsGrams: Number.parseInt(meal.carbs, 10) || 0,
        fatGrams: Number.parseInt(meal.fat, 10) || 0,
        sodiumMg: Number.parseInt(meal.sodium, 10) || null,
        allergens: meal.allergens || null,
        facilityNote: meal.facilityNote || null,
        imageUrl: meal.image,
        tag: meal.tag,
        dietaryTags: meal.dietaryTags,
        ingredients: meal.ingredients,
        isGlutenFree: meal.isGlutenFree,
        isActive: true,
      },
    });
  }

  const ownerEmails = ownerEmailsFromEnv();
  for (const email of ownerEmails) {
    await prisma.adminUserRole.upsert({
      where: { email },
      update: { role: "OWNER" },
      create: {
        email,
        role: "OWNER",
      },
    });
  }

  console.log(`Seeded ${plans.length} plans, ${featuredMeals.length} meals, and ${ownerEmails.length} owner roles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
