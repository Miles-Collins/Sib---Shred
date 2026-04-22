import type { Metadata } from "next";
import { Header } from "../components/landing/Header";
import { MenuCatalog } from "../components/menu/MenuCatalog";
import { getMealCatalog } from "@/lib/meal-catalog";
import { buildPageMetadata } from "@/lib/seo";
import { getMenuPageContentFromSanity } from "@/sanity/lib/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Weekly Menu | Chef-Prepared Meal Prep",
  description:
    "Browse Sib Method's weekly menu of chef-prepared meals, dietary filters, nutrition details, and local delivery options.",
  path: "/menu",
});

export default async function MenuPage() {
  const meals = await getMealCatalog();
  const menuPageContent = await getMenuPageContentFromSanity();
  const fallbackProgressSteps = ["Choose meals", "Set delivery", "Checkout"];
  const progressLabels =
    menuPageContent?.progressSteps && menuPageContent.progressSteps.length >= 3
      ? menuPageContent.progressSteps.slice(0, 3)
      : fallbackProgressSteps;
  const orderProgress = [
    { label: progressLabels[0], state: "active" },
    { label: progressLabels[1], state: "upcoming" },
    { label: progressLabels[2], state: "upcoming" },
  ] as const;

  return (
    <div className="flex min-h-full flex-col bg-(--background) text-(--ink)">
      <Header />

      <main className="flex w-full flex-1 flex-col gap-8 py-8 md:pb-28 xl:pb-8">
        <section className="motion-sticky rounded-2xl border border-(--line) bg-(--paper-soft) p-3 shadow-[0_10px_26px_rgba(16,27,23,0.06)] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="brand-kicker text-(--muted)">
              {menuPageContent?.progressKicker || "Order progress"}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold uppercase tracking-[0.09em] sm:w-md">
              {orderProgress.map((step, index) => (
                <div
                  key={step.label}
                  className={`rounded-full border px-2 py-2 ${
                    step.state === "active"
                      ? "border-(--sun) bg-(--sun) text-white"
                      : "border-(--line) bg-white text-(--muted)"
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
            {menuPageContent?.headerKicker || "Order meals"}
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {menuPageContent?.headerTitle || "Build your weekly menu"}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--muted) sm:text-base">
            {menuPageContent?.headerDescription ||
              "Similar to a marketplace-style ordering flow, but intentionally clean: filter by dietary needs, browse labels like GF/Vegan/Spicy, and click into each meal for full details and add-to-cart."}
          </p>
        </header>

        <MenuCatalog meals={meals} />
      </main>
    </div>
  );
}
