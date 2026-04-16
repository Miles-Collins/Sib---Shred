"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { createCheckoutOrder } from "./actions";
import { calculateCheckoutTotals, formatCents, priceToCents } from "@/lib/checkout-pricing";

type CartItem = {
  slug: string;
  name: string;
  price: string;
  image: string;
  qty: number;
};

function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem("sib-method-cart");
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

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("sib-method-cart", JSON.stringify(items));
  window.dispatchEvent(new Event("sib-method-cart-updated"));
}

export function CheckoutOrderForm({ shouldClearCart = false }: { shouldClearCart?: boolean }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => setCartItems(readCart());

    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("focus", syncCart);
    window.addEventListener("sib-method-cart-updated", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("focus", syncCart);
      window.removeEventListener("sib-method-cart-updated", syncCart);
    };
  }, []);

  useEffect(() => {
    if (!shouldClearCart || typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem("sib-method-cart");
    window.dispatchEvent(new Event("sib-method-cart-updated"));
  }, [shouldClearCart]);

  const updateItemQty = (slug: string, nextQty: number) => {
    setCartItems((current) => {
      const normalizedQty = Math.max(1, Math.min(24, Math.trunc(nextQty)));
      const updated = current.map((item) =>
        item.slug === slug
          ? {
              ...item,
              qty: normalizedQty,
            }
          : item,
      );

      writeCart(updated);
      return updated;
    });
  };

  const removeItem = (slug: string) => {
    setCartItems((current) => {
      const updated = current.filter((item) => item.slug !== slug);
      writeCart(updated);
      return updated;
    });
  };

  const cartSubtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + priceToCents(item.price) * item.qty, 0),
    [cartItems],
  );
  const { deliveryFeeCents, discountCents, totalCents } = calculateCheckoutTotals(cartSubtotal);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="brand-panel p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="brand-kicker text-(--muted)">Delivery details</p>
            <h2 className="brand-section-title mt-1 text-3xl sm:text-4xl">Where should meals go?</h2>
          </div>
          <Link href="/menu" className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-(--ink) underline-offset-4 hover:underline">
            Edit meals
          </Link>
        </div>

        <form action={createCheckoutOrder} className="mt-6 grid gap-4">
          <input type="hidden" name="planSlug" value="momentum" />
          <input type="hidden" name="cartJson" value={JSON.stringify(cartItems)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">First name</span>
              <input name="firstName" defaultValue="Alysha" className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" required />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">Last name</span>
              <input name="lastName" defaultValue="Shred" className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" required />
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">Email</span>
              <input name="email" type="email" defaultValue="alysha@example.com" className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" required />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">Phone</span>
              <input name="phone" defaultValue="(866) 442-3287" className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" />
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">Address</span>
              <input name="address1" defaultValue="123 Meal Prep Ave" className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" required />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">City</span>
              <input name="city" defaultValue="Localtown" className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" required />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">ZIP</span>
              <input name="postalCode" defaultValue="10001" className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" required />
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">Delivery notes</span>
              <textarea name="deliveryNotes" rows={3} className="brand-control rounded-xl border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2" placeholder="Gate code, drop-off instructions, or preferences" />
            </label>
          </div>

          <div className="mt-2 rounded-2xl border border-(--line) bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)">Delivery window</p>
            <p className="mt-2 text-base font-semibold text-(--ink)">Sunday, 2:00 PM - 6:00 PM</p>
            <p className="mt-2 text-sm leading-relaxed text-(--muted)">
              You will receive a reminder message before drop-off.
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/plans"
              className="brand-control rounded-full border border-(--ink) px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
            >
              Change plan
            </Link>
            <Link
              href="/menu"
              className="brand-control rounded-full border border-(--ink) px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
            >
              Add more meals
            </Link>
          </div>

          <button
            type="submit"
            disabled={cartItems.length === 0}
            className="brand-control mt-2 inline-flex w-full items-center justify-center rounded-full bg-(--sun) px-5 py-3 text-center text-sm font-bold uppercase tracking-widest text-white disabled:opacity-50"
          >
            Complete checkout
          </button>
        </form>
      </article>

      <aside className="brand-shell h-fit p-6 sm:p-7 lg:sticky lg:top-28">
        <p className="brand-kicker text-(--muted)">Order summary</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight">This week</h2>

        <div className="mt-5 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.slug} className="rounded-xl border border-(--line) bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-(--ink)">{item.name}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateItemQty(item.slug, item.qty - 1)}
                        className="brand-control inline-flex h-7 w-7 items-center justify-center rounded-md border border-(--line) bg-(--paper-soft) text-sm font-bold"
                        aria-label={`Decrease ${item.name}`}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold text-(--muted)">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateItemQty(item.slug, item.qty + 1)}
                        className="brand-control inline-flex h-7 w-7 items-center justify-center rounded-md border border-(--line) bg-(--paper-soft) text-sm font-bold"
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="brand-control ml-2 text-xs font-bold uppercase tracking-widest text-(--berry)"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-black text-(--ink)">{formatCents(priceToCents(item.price) * item.qty)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-(--line) bg-white p-4 text-sm text-(--muted)">
              Your cart is empty. Add meals from the menu to build an order.
            </div>
          )}
        </div>

        <div className="mt-5 space-y-2 border-t border-(--line) pt-4 text-sm">
          <div className="flex items-center justify-between text-(--muted)">
            <span>Subtotal</span>
            <span>{formatCents(cartSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-(--berry)">
            <span>Subscriber discount</span>
            <span>{discountCents ? `-${formatCents(discountCents)}` : "$0.00"}</span>
          </div>
          <div className="flex items-center justify-between text-(--muted)">
            <span>Delivery fee</span>
            <span>{formatCents(deliveryFeeCents)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-black text-(--ink)">
            <span>Total due now</span>
            <span>{formatCents(totalCents)}</span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-(--muted)">
          Order previews are stored in Prisma. Payment integration comes next.
        </p>
      </aside>
    </section>
  );
}
