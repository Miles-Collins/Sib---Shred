import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "../components/landing/Header";
import { CheckoutOrderForm } from "./CheckoutOrderForm";
import { formatCents } from "@/lib/checkout-pricing";
import { getOrderReceiptByNumberAndToken } from "@/lib/order-receipts";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout | Complete Your Meal Prep Order",
  description:
    "Review your Sib Method meal prep order, confirm delivery details, and complete checkout.",
  path: "/checkout",
  noIndex: true,
});

type CheckoutPageProps = {
  searchParams: Promise<{ success?: string; order?: string; t?: string; error?: string }>;
};

const checkoutSteps = [
  "Plan & meal selection",
  "Delivery details",
  "Review and payment",
];

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const isSuccess = params.success === "1";
  const successfulOrder = isSuccess && params.order && params.t
    ? await getOrderReceiptByNumberAndToken(params.order, params.t)
    : null;

  const orderProgress = [
    { label: "Choose meals", state: "complete" },
    { label: "Set delivery", state: "complete" },
    { label: "Checkout", state: "active" },
  ] as const;

  return (
    <div className="flex min-h-full flex-col bg-(--bg-cream) text-(--ink)">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        {isSuccess ? (
          <section className="rounded-2xl border border-(--sun) bg-(--mint)/45 px-5 py-4 shadow-[0_10px_26px_rgba(16,27,23,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">Order received</p>
            <p className="mt-2 text-lg font-black">Thanks, your order {params.order || ""} has been created.</p>
            <p className="mt-1 text-sm text-(--muted)">
              Your cart has been cleared and your order details are ready below.
            </p>
            {successfulOrder ? (
              <p className="mt-3">
                <Link
                  href={`/orders/${encodeURIComponent(successfulOrder.orderNumber)}?t=${encodeURIComponent(successfulOrder.receiptAccessToken)}`}
                  className="text-sm font-bold uppercase tracking-widest text-(--ink) underline decoration-(--ink) underline-offset-4"
                >
                  View permanent receipt
                </Link>
              </p>
            ) : null}
          </section>
        ) : null}

        {isSuccess && successfulOrder ? (
          <section className="brand-shell p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="brand-kicker text-(--muted)">Order snapshot</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">{successfulOrder.orderNumber}</h2>
                <p className="mt-2 text-sm text-(--muted)">
                  {successfulOrder.plan?.name ? `${successfulOrder.plan.name} plan` : "Weekly meal order"}
                </p>
              </div>
              <div className="rounded-xl border border-(--line) bg-white px-4 py-3 text-right">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)">Total charged</p>
                <p className="mt-1 text-2xl font-black text-(--ink)">{formatCents(successfulOrder.totalCents)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {successfulOrder.items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-(--line) bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-(--ink)">{item.meal.name}</p>
                      <p className="mt-1 text-sm text-(--muted)">Qty {item.quantity} x {formatCents(item.unitPriceCents)}</p>
                    </div>
                    <p className="text-base font-black text-(--ink)">{formatCents(item.totalCents)}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-(--line) pt-4 text-sm">
              <div className="flex items-center justify-between text-(--muted)">
                <span>Subtotal</span>
                <span>{formatCents(successfulOrder.subtotalCents)}</span>
              </div>
              <div className="flex items-center justify-between text-(--muted)">
                <span>Delivery fee</span>
                <span>{formatCents(successfulOrder.deliveryFeeCents)}</span>
              </div>
              <div className="flex items-center justify-between text-(--berry)">
                <span>Discount</span>
                <span>{successfulOrder.discountCents > 0 ? `-${formatCents(successfulOrder.discountCents)}` : "$0.00"}</span>
              </div>
              <div className="flex items-center justify-between text-base font-black text-(--ink)">
                <span>Total</span>
                <span>{formatCents(successfulOrder.totalCents)}</span>
              </div>
            </div>
          </section>
        ) : null}

        {params.error === "missing-fields" ? (
          <section className="rounded-2xl border border-[#b96a5b] bg-[#f8ece8] px-5 py-4">
            <p className="text-sm font-semibold text-[#8d3f31]">Please complete the required delivery fields before submitting.</p>
          </section>
        ) : null}

        {params.error === "empty-cart" ? (
          <section className="rounded-2xl border border-[#b96a5b] bg-[#f8ece8] px-5 py-4">
            <p className="text-sm font-semibold text-[#8d3f31]">Your cart is empty. Add at least one meal before checkout.</p>
          </section>
        ) : null}

        {params.error === "invalid-cart" ? (
          <section className="rounded-2xl border border-[#b96a5b] bg-[#f8ece8] px-5 py-4">
            <p className="text-sm font-semibold text-[#8d3f31]">We could not validate one or more cart items. Please review your cart and try again.</p>
          </section>
        ) : null}

        <section className="motion-sticky rounded-2xl border border-(--line) bg-white/92 p-3 shadow-[0_10px_26px_rgba(16,27,23,0.06)] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="brand-kicker text-(--muted)">Order progress</p>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold uppercase tracking-[0.09em] sm:w-md">
              {orderProgress.map((step, index) => (
                <div
                  key={step.label}
                  className={`rounded-full border px-2 py-2 ${
                    step.state === "active"
                      ? "border-(--ink) bg-(--ink) text-white"
                      : step.state === "complete"
                        ? "border-(--sun) bg-(--mint) text-(--ink)"
                        : "border-(--line) bg-(--paper-soft) text-(--muted)"
                  }`}
                >
                  <span className="mr-1">{index + 1}.</span>
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-shell p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">
            Checkout
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Finish your weekly order
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-(--muted) sm:text-base">
            One final step before Alysha starts prepping your meals. Review your plan,
            confirm delivery details, and place your order.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {checkoutSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-(--line) bg-white p-4">
                <p className="brand-kicker text-(--berry)">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-(--ink)">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <CheckoutOrderForm shouldClearCart={isSuccess} />

        <section className="brand-panel p-6 sm:p-8">
          <p className="brand-kicker text-(--muted)">Why customers stay</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Transparent pricing",
                text: "No surprise add-ons during checkout.",
              },
              {
                title: "Personal support",
                text: "Questions go directly to Alysha, not a call center.",
              },
              {
                title: "Weekly flexibility",
                text: "Adjust your meals as your schedule changes.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-(--line) bg-(--bg-cream) p-5">
                <p className="brand-kicker text-(--berry)">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-(--muted)">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
