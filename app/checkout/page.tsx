import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "../components/landing/Header";
import { CheckoutOrderForm } from "./CheckoutOrderForm";
import { formatCents } from "@/lib/checkout-pricing";
import { getOrderReceiptByNumberAndToken } from "@/lib/order-receipts";
import { buildPageMetadata } from "@/lib/seo";
import { getCheckoutPageContentFromSanity } from "@/sanity/lib/queries";

type SuccessfulOrder = NonNullable<Awaited<ReturnType<typeof getOrderReceiptByNumberAndToken>>>;
type SuccessfulOrderItem = SuccessfulOrder["items"][number];

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
  const checkoutContent = await getCheckoutPageContentFromSanity();
  const isSuccess = params.success === "1";
  const successfulOrder: SuccessfulOrder | null = isSuccess && params.order && params.t
    ? await getOrderReceiptByNumberAndToken(params.order, params.t)
    : null;

  const progressLabels =
    checkoutContent?.progressSteps && checkoutContent.progressSteps.length >= 3
      ? checkoutContent.progressSteps.slice(0, 3)
      : ["Choose meals", "Set delivery", "Checkout"];

  const orderProgress = [
    { label: progressLabels[0], state: "complete" },
    { label: progressLabels[1], state: "complete" },
    { label: progressLabels[2], state: "active" },
  ] as const;

  const checkoutStepsContent =
    checkoutContent?.checkoutSteps && checkoutContent.checkoutSteps.length > 0
      ? checkoutContent.checkoutSteps
      : checkoutSteps;

  const retentionCards =
    checkoutContent?.retentionCards && checkoutContent.retentionCards.length > 0
      ? checkoutContent.retentionCards
      : [
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
        ];

  return (
    <div className="page-cream flex min-h-full flex-col bg-(--bg-cream) text-(--ink)">
      <Header />

      <main className="flex w-full flex-1 flex-col gap-8 py-10 md:pb-28 xl:pb-10">
        {isSuccess ? (
          <section className="rounded-2xl border border-(--border-light) bg-[#F7EFE5] px-5 py-4 shadow-md shadow-black/5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">
              {checkoutContent?.successKicker || "Order received"}
            </p>
            <p className="mt-2 text-lg font-black">
              {checkoutContent?.successMessage || `Thanks, your order ${params.order || ""} has been created.`}
            </p>
            <p className="mt-1 text-sm text-(--muted)">
              Your cart has been cleared and your order details are ready below.
            </p>
            {successfulOrder ? (
              <p className="mt-3">
                <Link
                  href={`/orders/${encodeURIComponent(successfulOrder.orderNumber)}?t=${encodeURIComponent(successfulOrder.receiptAccessToken)}`}
                  className="text-sm font-bold uppercase tracking-widest text-[#5FA8C7] underline decoration-[#5FA8C7] underline-offset-4"
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
              <div className="rounded-xl border border-(--border-light) bg-white px-4 py-3 text-right shadow-md shadow-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--text-secondary)">Total charged</p>
                <p className="mt-1 text-2xl font-black text-(--ink)">{formatCents(successfulOrder.totalCents)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {successfulOrder.items.map((item: SuccessfulOrderItem) => (
                <article key={item.id} className="rounded-2xl border border-(--border-light) bg-white p-4 shadow-md shadow-black/5">
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
          <section className="rounded-2xl border border-[#e4cfb0] bg-[#F7EFE5] px-5 py-4 shadow-md shadow-black/5">
            <p className="text-sm font-semibold text-(--text-secondary)">
              {checkoutContent?.missingFieldsError || "Please complete the required delivery fields before submitting."}
            </p>
          </section>
        ) : null}

        {params.error === "empty-cart" ? (
          <section className="rounded-2xl border border-[#e4cfb0] bg-[#F7EFE5] px-5 py-4 shadow-md shadow-black/5">
            <p className="text-sm font-semibold text-(--text-secondary)">
              {checkoutContent?.emptyCartError || "Your cart is empty. Add at least one meal before checkout."}
            </p>
          </section>
        ) : null}

        {params.error === "invalid-cart" ? (
          <section className="rounded-2xl border border-[#e4cfb0] bg-[#F7EFE5] px-5 py-4 shadow-md shadow-black/5">
            <p className="text-sm font-semibold text-(--text-secondary)">
              {checkoutContent?.invalidCartError || "We could not validate one or more cart items. Please review your cart and try again."}
            </p>
          </section>
        ) : null}

        <section className="motion-sticky rounded-2xl border border-(--border-light) bg-[#F4FAFD] p-3 shadow-md shadow-black/5 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="brand-kicker text-(--muted)">
              {checkoutContent?.headerKicker || "Order progress"}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold uppercase tracking-[0.09em] sm:w-md">
              {orderProgress.map((step, index) => (
                <div
                  key={step.label}
                  className={`rounded-full border px-2 py-2 ${
                    step.state === "active"
                      ? "border-[#5FA8C7] bg-[#5FA8C7] text-white"
                      : step.state === "complete"
                        ? "border-[#7FC8E3] bg-[#EAF6FB] text-(--ink)"
                        : "border-(--border-light) bg-white text-(--muted)"
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
            {checkoutContent?.headerKicker || "Checkout"}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {checkoutContent?.headerTitle || "Finish your weekly order"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-(--muted) sm:text-base">
            {checkoutContent?.headerDescription ||
              "One final step before Alysha starts prepping your meals. Review your plan, confirm delivery details, and place your order."}
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {checkoutStepsContent.map((step, index) => (
              <div key={step} className="rounded-2xl border border-(--border-light) bg-white p-4 shadow-md shadow-black/5">
                <p className="brand-kicker text-(--berry)">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-(--ink)">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <CheckoutOrderForm shouldClearCart={isSuccess} />

        <section className="brand-panel p-6 sm:p-8">
          <p className="brand-kicker text-(--muted)">
            {checkoutContent?.retentionKicker || "Why customers stay"}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {retentionCards.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#e4cfb0] bg-[#F7EFE5] p-5 shadow-md shadow-black/5">
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
