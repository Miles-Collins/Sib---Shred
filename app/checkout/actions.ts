"use server";

import { redirect } from "next/navigation";

import { plans } from "../components/landing/data";
import { getMealBySlug, getPlanBySlug } from "@/lib/meal-catalog";
import { calculateCheckoutTotals, priceToCents } from "@/lib/checkout-pricing";
import { prisma } from "@/lib/prisma";

type CartItemInput = {
  slug: string;
  name: string;
  price: string;
  image: string;
  qty: number;
};

const MAX_DISTINCT_CART_ITEMS = 20;
const MAX_ITEM_QTY = 24;

function parseCart(formData: FormData): CartItemInput[] {
  const rawCart = String(formData.get("cartJson") || "").trim();

  if (!rawCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawCart) as CartItemInput[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    const bySlug = new Map<string, CartItemInput>();

    for (const item of parsed) {
      if (!item || typeof item.slug !== "string" || !Number.isFinite(item.qty)) {
        continue;
      }

      const slug = item.slug.trim();
      if (!slug) {
        continue;
      }

      const normalizedQty = Math.max(1, Math.min(MAX_ITEM_QTY, Math.trunc(item.qty)));
      const existing = bySlug.get(slug);

      if (existing) {
        existing.qty = Math.min(MAX_ITEM_QTY, existing.qty + normalizedQty);
      } else {
        bySlug.set(slug, {
          slug,
          name: String(item.name || slug),
          price: String(item.price || "$0"),
          image: String(item.image || ""),
          qty: normalizedQty,
        });
      }
    }

    return Array.from(bySlug.values()).slice(0, MAX_DISTINCT_CART_ITEMS);
  } catch {
    return [];
  }
}

export async function createCheckoutOrder(formData: FormData) {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const address1 = String(formData.get("address1") || "").trim();
  const address2 = String(formData.get("address2") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const postalCode = String(formData.get("postalCode") || "").trim();
  const notes = String(formData.get("deliveryNotes") || "").trim();
  const planSlug = String(formData.get("planSlug") || "momentum").trim() || "momentum";
  const cart = parseCart(formData);

  if (!firstName || !lastName || !email || !address1 || !city || !postalCode) {
    redirect("/checkout?error=missing-fields");
  }

  if (cart.length === 0) {
    redirect("/checkout?error=empty-cart");
  }

  if (cart.length > MAX_DISTINCT_CART_ITEMS) {
    redirect("/checkout?error=invalid-cart");
  }

  const selectedPlan = (await getPlanBySlug(planSlug)) ?? plans[1];
  const mealRows = await Promise.all(
    cart.map(async (item) => {
      const sourceMeal = await getMealBySlug(item.slug);

      if (!sourceMeal) {
        return null;
      }

      const trustedUnitPriceCents = priceToCents(sourceMeal.price);

      return {
        slug: item.slug,
        name: sourceMeal.name,
        subtitle: sourceMeal.subtitle ?? null,
        description: sourceMeal.description,
        priceCents: trustedUnitPriceCents,
        calories: sourceMeal.calories,
        proteinGrams: Number.parseInt(sourceMeal.protein, 10) || 0,
        carbsGrams: Number.parseInt(sourceMeal.carbs, 10) || 0,
        fatGrams: Number.parseInt(sourceMeal.fat, 10) || 0,
        sodiumMg: Number.parseInt(sourceMeal.sodium ?? "0", 10) || null,
        allergens: sourceMeal.allergens ?? null,
        facilityNote: sourceMeal.facilityNote ?? null,
        imageUrl: sourceMeal.image,
        tag: sourceMeal.tag,
        dietaryTags: sourceMeal.dietaryTags,
        ingredients: sourceMeal.ingredients,
        isGlutenFree: sourceMeal.isGlutenFree,
        quantity: item.qty,
        unitPriceCents: trustedUnitPriceCents,
        totalCents: trustedUnitPriceCents * item.qty,
      };
    }),
  );

  if (mealRows.some((item) => item === null)) {
    redirect("/checkout?error=invalid-cart");
  }

  const safeMealRows = mealRows.filter((item): item is NonNullable<typeof item> => item !== null);
  const subtotalCents = safeMealRows.reduce((acc, item) => acc + item.totalCents, 0);
  const { deliveryFeeCents, discountCents, totalCents } = calculateCheckoutTotals(subtotalCents);

  const orderNumber = `SM-${Date.now().toString(36).toUpperCase()}`;

  const createdOrder = await prisma.$transaction(async (tx) => {
    const planRecord = await tx.plan.upsert({
      where: { slug: slugify(selectedPlan.title) },
      update: {
        name: selectedPlan.title,
        description: selectedPlan.detail,
        weeklyMeals: Number.parseInt(selectedPlan.detail, 10),
        priceCents: priceToCents(selectedPlan.price),
        isActive: true,
      },
      create: {
        slug: slugify(selectedPlan.title),
        name: selectedPlan.title,
        description: selectedPlan.detail,
        weeklyMeals: Number.parseInt(selectedPlan.detail, 10),
        priceCents: priceToCents(selectedPlan.price),
        isActive: true,
      },
    });

    const order = await tx.order.create({
      data: {
        orderNumber,
        status: "pending",
        planId: planRecord.id,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: email,
        customerPhone: phone || null,
        deliveryAddress1: address1,
        deliveryAddress2: address2 || null,
        deliveryCity: city,
        deliveryState: state || null,
        deliveryPostalCode: postalCode,
        deliveryNotes: notes || null,
        subtotalCents,
        discountCents,
        deliveryFeeCents,
        totalCents,
      },
    });

    for (const item of safeMealRows) {
      const mealRecord = await tx.meal.upsert({
        where: { slug: item.slug },
        update: {
          name: item.name,
          subtitle: item.subtitle,
          description: item.description,
          priceCents: item.priceCents,
          calories: item.calories,
          proteinGrams: item.proteinGrams,
          carbsGrams: item.carbsGrams,
          fatGrams: item.fatGrams,
          sodiumMg: item.sodiumMg,
          allergens: item.allergens,
          facilityNote: item.facilityNote,
          imageUrl: item.imageUrl,
          tag: item.tag,
          dietaryTags: item.dietaryTags,
          ingredients: item.ingredients,
          isGlutenFree: item.isGlutenFree,
          isActive: true,
        },
        create: {
          slug: item.slug,
          name: item.name,
          subtitle: item.subtitle,
          description: item.description,
          priceCents: item.priceCents,
          calories: item.calories,
          proteinGrams: item.proteinGrams,
          carbsGrams: item.carbsGrams,
          fatGrams: item.fatGrams,
          sodiumMg: item.sodiumMg,
          allergens: item.allergens,
          facilityNote: item.facilityNote,
          imageUrl: item.imageUrl,
          tag: item.tag,
          dietaryTags: item.dietaryTags,
          ingredients: item.ingredients,
          isGlutenFree: item.isGlutenFree,
          isActive: true,
        },
      });

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          mealId: mealRecord.id,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          totalCents: item.totalCents,
        },
      });
    }

    return order;
  });

  redirect(
    `/checkout?success=1&order=${encodeURIComponent(createdOrder.orderNumber)}&t=${encodeURIComponent(createdOrder.receiptAccessToken)}`,
  );
}