import type { Metadata } from "next";
import { Header } from "../components/landing/Header";
import { MenuCatalog } from "../components/menu/MenuCatalog";
import { getMealCatalog } from "@/lib/meal-catalog";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Weekly Menu | Chef-Prepared Meal Prep",
  description:
    "Browse Sib Method's weekly menu of chef-prepared meals, dietary filters, nutrition details, and local delivery options.",
  path: "/menu",
});

export default async function MenuPage() {
  const meals = await getMealCatalog();
  const orderProgress = [
    { label: "Choose meals", state: "active" },
    { label: "Set delivery", state: "upcoming" },
    { label: "Checkout", state: "upcoming" },
  ] as const;

  return (
    <div className="flex min-h-full flex-col bg-(--bg-cream) text-(--ink)">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8">
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

        <header className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">
            Order meals
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Build your weekly menu
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--muted) sm:text-base">
            Similar to a marketplace-style ordering flow, but intentionally clean:
            filter by dietary needs, browse labels like GF/Vegan/Spicy, and click
            into each meal for full details and add-to-cart.
          </p>
        </header>

        <MenuCatalog meals={meals} />
      </main>
    </div>
  );
}
