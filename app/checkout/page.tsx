import Link from "next/link";

import { Header } from "../components/landing/Header";

const checkoutSteps = [
  "Plan & meal selection",
  "Delivery details",
  "Review and payment",
];

const summaryItems = [
  {
    name: "Momentum Plan",
    detail: "10 meals / week",
    price: 108,
  },
  {
    name: "Local delivery",
    detail: "Weekly drop window",
    price: 8,
  },
];

export default function CheckoutPage() {
  const subtotal = summaryItems.reduce((acc, item) => acc + item.price, 0);
  const discount = 10;
  const total = subtotal - discount;

  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <section className="brand-shell p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Checkout
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Finish your weekly order
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            One final step before Alysha starts prepping your meals. Review your plan,
            confirm delivery details, and place your order.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {checkoutSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <p className="brand-kicker text-[var(--berry)]">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="brand-panel p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="brand-kicker text-[var(--muted)]">Delivery details</p>
                <h2 className="brand-section-title mt-1 text-3xl sm:text-4xl">Where should meals go?</h2>
              </div>
              <Link href="/menu" className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)] underline-offset-4 hover:underline">
                Edit meals
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "First name", value: "Alysha" },
                { label: "Last name", value: "Shred" },
                { label: "Email", value: "alysha@example.com" },
                { label: "Phone", value: "(866) 442-3287" },
                { label: "Address", value: "123 Meal Prep Ave" },
                { label: "City / ZIP", value: "Localtown, 10001" },
              ].map((field) => (
                <div key={field.label} className="rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {field.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--ink)]">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Delivery window
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--ink)]">Sunday, 2:00 PM - 6:00 PM</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                You will receive a reminder message before drop-off.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/plans"
                className="brand-control rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
              >
                Change plan
              </Link>
              <Link
                href="/menu"
                className="brand-control rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
              >
                Add more meals
              </Link>
            </div>
          </article>

          <aside className="brand-shell h-fit p-6 sm:p-7 lg:sticky lg:top-28">
            <p className="brand-kicker text-[var(--muted)]">Order summary</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">This week</h2>

            <div className="mt-5 space-y-4">
              {summaryItems.map((item) => (
                <div key={item.name} className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.1em] text-[var(--ink)]">{item.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{item.detail}</p>
                    </div>
                    <p className="text-base font-black text-[var(--ink)]">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--berry)]">
                <span>Subscriber discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-black text-[var(--ink)]">
                <span>Total due now</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="brand-control mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--sun)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.1em] text-white"
            >
              Complete checkout
            </button>

            <p className="mt-3 text-center text-xs text-[var(--muted)]">
              Secure checkout preview. Payment integration comes next.
            </p>
          </aside>
        </section>

        <section className="brand-panel p-6 sm:p-8">
          <p className="brand-kicker text-[var(--muted)]">Why customers stay</p>
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
              <article key={item.title} className="rounded-2xl border border-[var(--line)] bg-[var(--bg-cream)] p-5">
                <p className="brand-kicker text-[var(--berry)]">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
