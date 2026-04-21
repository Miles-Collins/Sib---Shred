import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "../components/landing/Header";
import { plans } from "../components/landing/data";
import { buildPageMetadata } from "@/lib/seo";
import { getPlansPageContentFromSanity } from "@/sanity/lib/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Plans & Pricing | Weekly Meal Prep Savings",
  description:
    "Compare Sib Method's weekly meal prep plans, pricing, and savings to find the right fit for your routine.",
  path: "/plans",
});

const A_LA_CARTE_PRICE = 7;

const savingsRows = plans.map((plan) => {
  const mealsPerWeek = Number(plan.detail.match(/\d+/)?.[0] ?? 0);
  const weeklyAlaCarte = mealsPerWeek * A_LA_CARTE_PRICE;
  const weeklySavings = weeklyAlaCarte - Number(plan.price.replace("$", ""));

  return {
    ...plan,
    mealsPerWeek,
    weeklyAlaCarte,
    weeklySavings,
    monthlySavings: weeklySavings * 4,
  };
});

export default function PlansPage() {
  const pageContentPromise = getPlansPageContentFromSanity();
  return <PlansPageContent pageContentPromise={pageContentPromise} />;
}

async function PlansPageContent({
  pageContentPromise,
}: {
  pageContentPromise: ReturnType<typeof getPlansPageContentFromSanity>;
}) {
  const pageContent = await pageContentPromise;
  const featuredPlan = savingsRows[1];
  const valueCards =
    pageContent?.valueCards && pageContent.valueCards.length > 0
      ? pageContent.valueCards.slice(0, 3)
      : [
          { label: "Best value", title: "Momentum", text: "Balanced volume and savings." },
          { label: "Avg ala carte", title: `$${A_LA_CARTE_PRICE.toFixed(2)}`, text: "Per meal, before fees." },
          { label: "Cancel anytime", title: "No contract", text: "Pause or skip with ease." },
        ];
  const whyCards =
    pageContent?.whyCards && pageContent.whyCards.length > 0
      ? pageContent.whyCards
      : [
          {
            title: "For lighter weeks",
            text: "Starter keeps things simple if you want a few reliable meals without overcommitting.",
          },
          {
            title: "Best balance",
            text: "Momentum gives you the strongest blend of savings, convenience, and variety.",
          },
          {
            title: "Maximum savings",
            text: "All In is the best value if you want most of your lunches and dinners handled for the week.",
          },
        ];
  const faqs =
    pageContent?.faqs && pageContent.faqs.length > 0
      ? pageContent.faqs
      : [
          {
            question: "Which plan gives the best savings?",
            answer: "Momentum is the best value for most people because it balances meal count and price per meal.",
          },
          {
            question: "Can I change plans later?",
            answer: "Yes. Start with the plan that fits your week now and adjust as your routine changes.",
          },
          {
            question: "Is this good for one person?",
            answer: "Yes. The whole menu and pricing structure are built around practical weekly routines for one person.",
          },
          {
            question: "What if I want more meals?",
            answer: "Choose the larger plan for better savings per meal, then scale down later if needed.",
          },
        ];

  return (
    <div className="flex min-h-full flex-col bg-(--bg-cream) text-(--ink)">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-5 py-10 sm:px-8">
        <section className="brand-shell grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">
              {pageContent?.heroKicker || "Subscribe and save"}
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              {pageContent?.heroTitle || "Simple weekly plans with built-in savings."}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--muted) sm:text-base">
              {pageContent?.heroDescription ||
                "Plans are designed for one person who wants fresh meals without a kitchen full of leftovers. The more you order, the lower your average meal cost becomes."}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {valueCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-(--line) bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--muted)">
                    {card.label}
                  </p>
                  <p className="mt-2 text-lg font-black text-(--ink)">{card.title}</p>
                  <p className="mt-1 text-sm text-(--muted)">{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="brand-panel overflow-hidden p-6 sm:p-7">
            <p className="brand-kicker text-(--muted)">
              {pageContent?.savingsKicker || "Savings snapshot"}
            </p>
            <div className="mt-4 space-y-4">
              {savingsRows.map((plan, index) => (
                <div
                  key={plan.title}
                  className={`rounded-2xl border p-4 ${
                    index === 1
                      ? "border-(--sun) bg-(--mint)/50"
                      : "border-(--line) bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.12em] text-(--muted)">
                        {plan.title}
                      </p>
                      <p className="mt-1 text-lg font-black text-(--ink)">{plan.detail}</p>
                    </div>
                    {index === 1 ? (
                      <span className="brand-badge brand-badge--green rounded-[0.2rem] px-2 py-1 text-[11px]">
                        Best Value
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">
                        Weekly price
                      </p>
                      <p className="mt-1 text-lg font-black">{plan.price}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">
                        vs ala carte
                      </p>
                      <p className="mt-1 text-lg font-black">-${plan.weeklySavings.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-(--muted)">
                        Monthly save
                      </p>
                      <p className="mt-1 text-lg font-black text-(--berry)">-${plan.monthlySavings.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {savingsRows.map((plan) => (
            <article
              key={plan.title}
              className={`motion-lift brand-panel p-6 ${plan.title === featuredPlan.title ? "border-(--sun)" : ""}`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-(--muted)">
                {plan.title}
              </p>
              <p className="mt-2 text-lg font-semibold">{plan.detail}</p>
              <div className="mt-5 flex items-end gap-3">
                <p className="text-4xl font-black tracking-tight">{plan.price}</p>
                <p className="pb-1 text-sm text-(--muted)">per week</p>
              </div>
              <p className="mt-2 text-sm text-(--muted)">
                Estimated savings of ${plan.weeklySavings.toFixed(2)} per week versus ordering meals individually.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-(--muted)">
                <li>Chef-prepared weekly menu</li>
                <li>Pause or skip anytime</li>
                <li>Insulated local delivery</li>
              </ul>
              <Link
                href="/checkout"
                className={`brand-control mt-6 inline-block w-full rounded-full px-4 py-3 text-center text-sm font-bold uppercase tracking-widest text-white ${
                  plan.title === featuredPlan.title ? "bg-(--sun)" : "bg-(--ink)"
                }`}
              >
                Choose plan
              </Link>
            </article>
          ))}
        </section>

        <section className="brand-shell grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="brand-kicker text-(--muted)">
              {pageContent?.whyKicker || "Why it feels elevated"}
            </p>
            <h2 className="brand-section-title mt-2 text-3xl sm:text-4xl">
              {pageContent?.whyTitle || "The plan gets more efficient as your week gets busier."}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--muted) sm:text-base">
              {pageContent?.whyDescription ||
                "Instead of paying one-off delivery fees and picking through random meals, you lock in a cleaner weekly routine. That means less friction, less waste, and a lower cost per meal the more you order."}
            </p>
          </div>

          <div className="grid gap-3">
            {whyCards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-(--line) bg-white p-5">
                <p className="brand-kicker text-(--berry)">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-(--muted)">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="brand-panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="brand-kicker text-(--muted)">
                {pageContent?.faqKicker || "Common questions"}
              </p>
              <h2 className="brand-section-title mt-1 text-3xl sm:text-4xl">
                {pageContent?.faqTitle || "What should I choose?"}
              </h2>
            </div>
            <Link href="/about" className="brand-nav-link text-sm font-bold uppercase tracking-[0.12em] text-(--ink) underline-offset-4 hover:underline">
              Learn more about Alysha
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-2xl border border-(--line) bg-(--bg-cream) p-5">
                <p className="text-sm font-bold uppercase tracking-widest text-(--ink)">{item.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-(--muted)">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-(--line) bg-(--mint)/45 p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">
                {pageContent?.bottomCtaKicker || "Ready when you are"}
              </p>
              <h2 className="mt-2 text-3xl leading-tight font-black tracking-tight sm:text-5xl">
                {pageContent?.bottomCtaTitle || "Pick a plan that fits your week."}
              </h2>
            </div>
            <Link
              href="/checkout"
              className="brand-control rounded-full bg-(--ink) px-8 py-4 text-center text-sm font-bold uppercase tracking-widest text-white"
            >
              {pageContent?.bottomCtaButtonLabel || "Start order"}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

