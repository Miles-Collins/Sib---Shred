import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "../../components/landing/Header";
import { formatCents } from "@/lib/checkout-pricing";
import { getOrderReceiptByNumberAndToken } from "@/lib/order-receipts";
import { getOrderReceiptPageContentFromSanity } from "@/sanity/lib/queries";

type ReceiptOrder = NonNullable<Awaited<ReturnType<typeof getOrderReceiptByNumberAndToken>>>;
type ReceiptOrderItem = ReceiptOrder["items"][number];

type OrderReceiptPageProps = {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({ params }: OrderReceiptPageProps): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Order ${orderNumber} | Receipt`,
    description: `Order receipt for ${orderNumber}.`,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function OrderReceiptPage({ params, searchParams }: OrderReceiptPageProps) {
  const { orderNumber } = await params;
  const pageContent = await getOrderReceiptPageContentFromSanity();
  const query = await searchParams;

  if (!query.t) {
    notFound();
  }

  const order: ReceiptOrder | null = await getOrderReceiptByNumberAndToken(orderNumber, query.t);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col bg-(--bg-cream) text-(--ink)">
      <Header />

      <main className="flex w-full flex-1 flex-col gap-8 py-10">
        <section className="brand-shell p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="brand-kicker text-(--muted)">
                {pageContent?.receiptKicker || "Order receipt"}
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{order.orderNumber}</h1>
              <p className="mt-2 text-sm text-(--muted)">
                {order.plan?.name ? `${order.plan.name} plan` : "Weekly meal order"}
              </p>
            </div>
            <div className="rounded-xl border border-(--line) bg-white px-4 py-3 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)">
                {pageContent?.totalLabel || "Order total"}
              </p>
              <p className="mt-1 text-2xl font-black text-(--ink)">{formatCents(order.totalCents)}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-(--muted)">
                {pageContent?.paymentStatusPrefix || "Payment status:"} {order.paymentStatus}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {order.items.map((item: ReceiptOrderItem) => (
              <article key={item.id} className="rounded-2xl border border-(--line) bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-(--ink)">{item.meal.name}</p>
                    <p className="mt-1 text-sm text-(--muted)">
                      Qty {item.quantity} x {formatCents(item.unitPriceCents)}
                    </p>
                  </div>
                  <p className="text-base font-black text-(--ink)">{formatCents(item.totalCents)}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-(--line) pt-4 text-sm">
            <div className="flex items-center justify-between text-(--muted)">
              <span>{pageContent?.subtotalLabel || "Subtotal"}</span>
              <span>{formatCents(order.subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between text-(--muted)">
              <span>{pageContent?.deliveryFeeLabel || "Delivery fee"}</span>
              <span>{formatCents(order.deliveryFeeCents)}</span>
            </div>
            <div className="flex items-center justify-between text-(--berry)">
              <span>{pageContent?.discountLabel || "Discount"}</span>
              <span>{order.discountCents > 0 ? `-${formatCents(order.discountCents)}` : "$0.00"}</span>
            </div>
            <div className="flex items-center justify-between text-base font-black text-(--ink)">
              <span>{pageContent?.totalSummaryLabel || "Total"}</span>
              <span>{formatCents(order.totalCents)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="brand-control rounded-full border border-(--ink) px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
            >
              {pageContent?.orderAgainLabel || "Order again"}
            </Link>
            <Link
              href="/checkout"
              className="brand-control rounded-full border border-(--line) px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
            >
              {pageContent?.backToCheckoutLabel || "Back to checkout"}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}