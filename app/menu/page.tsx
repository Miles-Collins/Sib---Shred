import { Header } from "../components/landing/Header";
import { featuredMeals } from "../components/landing/data";
import { MenuCatalog } from "../components/menu/MenuCatalog";

export default function MenuPage() {
  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8">
        <header className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Order meals
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Build your weekly menu
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Similar to a marketplace-style ordering flow, but intentionally clean:
            filter by dietary needs, browse labels like GF/Vegan/Spicy, and click
            into each meal for full details and add-to-cart.
          </p>
        </header>

        <MenuCatalog meals={featuredMeals} />
      </main>
    </div>
  );
}
