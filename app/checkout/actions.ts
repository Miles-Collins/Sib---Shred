"use server";

import { redirect } from "next/navigation";

import { plans } from "../components/landing/data";
import { getMealBySlug, getPlanBySlug } from "@/lib/meal-catalog";
import { prisma } from "@/lib/prisma";

function priceToCents(price: string) {
  return Math.round(Number.parseFloat(price.replace(/[^0-9.]/g, "")) * 100);
}

type CartItemInput = {
  slug: string;
  name: string;
  price: string;
  image: string;
  qty: number;
};

function parseCart(formData: FormData): CartItemInput[] {
  const rawCart = String(formData.get("cartJson") || "").trim();

  if (!rawCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawCart) as CartItemInput[];
    return Array.isArray(parsed)
      ? parsed
          .filter((item) => item && typeof item.slug === "string" && Number.isFinite(item.qty))
          .map((item) => ({
            slug: String(item.slug),
            name: String(item.name || item.slug),
            price: String(item.price || "$0"),
            image: String(item.image || ""),
            qty: Math.max(1, Math.trunc(item.qty)),
          }))
      : [];
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

  const selectedPlan = (await getPlanBySlug(planSlug)) ?? plans[1];
  const mealRows = await Promise.all(
    cart.map(async (item) => {
      const sourceMeal = await getMealBySlug(item.slug);

      return {
        slug: item.slug,
        name: sourceMeal?.name ?? item.name,
        subtitle: sourceMeal?.subtitle ?? null,
        description: sourceMeal?.description ?? `${item.name} prepared for Sib Method orders.`,
        priceCents: priceToCents(item.price),
        calories: sourceMeal?.calories ?? 0,
        proteinGrams: Number.parseInt(sourceMeal?.protein ?? "0", 10) || 0,
        carbsGrams: Number.parseInt(sourceMeal?.carbs ?? "0", 10) || 0,
        fatGrams: Number.parseInt(sourceMeal?.fat ?? "0", 10) || 0,
        sodiumMg: Number.parseInt(sourceMeal?.sodium ?? "0", 10) || null,
        allergens: sourceMeal?.allergens ?? null,
        facilityNote: sourceMeal?.facilityNote ?? null,
        imageUrl: sourceMeal?.image ?? item.image,
        tag: sourceMeal?.tag ?? "Chef Pick",
        dietaryTags: sourceMeal?.dietaryTags ?? [],
        ingredients: sourceMeal?.ingredients ?? [],
        isGlutenFree: sourceMeal?.isGlutenFree ?? false,
        quantity: item.qty,
        unitPriceCents: priceToCents(item.price),
        totalCents: priceToCents(item.price) * item.qty,
      };
    }),
  );

  const subtotalCents = mealRows.reduce((acc, item) => acc + item.totalCents, 0);
  const deliveryFeeCents = 800;
  const discountCents = subtotalCents >= 10000 ? 1000 : 0;
  const totalCents = subtotalCents + deliveryFeeCents - discountCents;

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

    for (const item of mealRows) {
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

  redirect(`/checkout?success=1&order=${encodeURIComponent(createdOrder.orderNumber)}`);
}