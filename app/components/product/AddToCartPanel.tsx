"use client";

import { useState } from "react";

import type { Meal } from "../landing/types";

type CartItem = {
  slug: string;
  name: string;
  price: string;
  image: string;
  qty: number;
};

type AddToCartPanelProps = {
  meal: Meal;
  compact?: boolean;
};

function readCart(): CartItem[] {
  const raw = localStorage.getItem("sibshred-cart");
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AddToCartPanel({ meal, compact = false }: AddToCartPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<string>("");

  const decrease = () => setQuantity((current) => Math.max(1, current - 1));
  const increase = () => setQuantity((current) => current + 1);

  const addToCart = () => {
    const cart = readCart();
    const existing = cart.find((item) => item.slug === meal.slug);

    if (existing) {
      existing.qty += quantity;
    } else {
      cart.push({
        slug: meal.slug,
        name: meal.name,
        price: meal.price,
        image: meal.image,
        qty: quantity,
      });
    }

    localStorage.setItem("sibshred-cart", JSON.stringify(cart));
    setStatus(`Added ${quantity} to cart`);
  };

  return (
    <div className="space-y-3 pt-3">
      <p className={`${compact ? "text-3xl" : "text-5xl"} font-black leading-none text-[var(--berry)]`}>
        {meal.price}
      </p>
      <p className="text-sm font-medium text-[var(--muted)]">In stock and ready to schedule</p>
      <div className="grid gap-3 sm:grid-cols-[auto_auto_1fr] sm:items-center">
        <button
          type="button"
          onClick={decrease}
          className="brand-control inline-flex h-11 items-center justify-center rounded-md border border-[var(--line)] bg-white px-4 font-semibold sm:w-11"
        >
          -
        </button>
        <span className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--line)] bg-white px-5 font-semibold">
          {quantity}
        </span>
        <button
          type="button"
          onClick={increase}
          className="brand-control inline-flex h-11 items-center justify-center rounded-md border border-[var(--line)] bg-white px-4 font-semibold sm:w-11"
        >
          +
        </button>
        <button
          type="button"
          onClick={addToCart}
          className={`brand-control inline-flex h-11 items-center justify-center rounded-md bg-[var(--sun)] font-bold text-white ${
            compact ? "px-5 py-2" : "px-6 py-2.5"
          }`}
        >
          Add to cart
        </button>
      </div>
      {status ? <p className="text-sm font-semibold text-[var(--berry)]">{status}</p> : null}
    </div>
  );
}
