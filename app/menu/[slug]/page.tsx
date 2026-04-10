import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { featuredMeals, getMealBySlug } from "../../components/landing/data";
import { AddToCartPanel } from "../../components/product/AddToCartPanel";
import { YouMightAlsoLikeCarousel } from "../../components/product/YouMightAlsoLikeCarousel";

type MealPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredMeals.map((meal) => ({ slug: meal.slug }));
}

function macroPercent(value: string, max: number) {
  const numeric = Number.parseInt(value, 10);
  return Math.min(100, Math.round((numeric / max) * 100));
}

export default async function MealPage({ params }: MealPageProps) {
  const { slug } = await params;
  const meal = getMealBySlug(slug);

  if (!meal) {
    notFound();
  }

  const proteinPct = macroPercent(meal.protein, 50);
  const carbsPct = macroPercent(meal.carbs, 70);
  const fatPct = macroPercent(meal.fat, 30);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-5 py-6 sm:px-8">
      <div className="text-sm text-[var(--muted)]">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/menu" className="hover:underline">
          Menu
        </Link>{" "}
        / {meal.name}
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-lg border border-[var(--line)] bg-white p-2">
          <Image
            src={meal.image}
            alt={meal.name}
            width={1400}
            height={920}
            className="w-full rounded-md object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black leading-tight tracking-tight">
            {meal.name}
            {meal.subtitle ? ` | ${meal.subtitle}` : ""}
          </h1>
          <p className="text-xl text-[var(--muted)]">{meal.description}</p>

          <div className="space-y-1.5 pt-2 text-lg">
            <p>Calories: {meal.calories}</p>
            <p>Protein: {meal.protein}</p>
            <p>Carbs: {meal.carbs}</p>
            <p>Fat: {meal.fat}</p>
            <p>Sodium: {meal.sodium}</p>
            {meal.isGlutenFree ? <p>Gluten Free</p> : null}
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              Ingredients
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
              {meal.ingredients.join(", ")}.
            </p>
          </div>

          <AddToCartPanel meal={meal} />
        </div>
      </section>

      <section className="space-y-6 rounded-2xl bg-[#e9ece8] px-5 py-12 sm:px-10">
        <h2 className="text-center text-5xl font-medium tracking-tight">Nutrition Facts</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white text-5xl font-black">
              {meal.calories}
            </div>
            <p className="mt-4 text-3xl font-semibold">Calories</p>
          </div>

          <div className="text-center">
            <div
              className="mx-auto flex h-40 w-40 items-center justify-center rounded-full text-5xl font-black"
              style={{
                background: `conic-gradient(#f5aa1a ${proteinPct}%, #f0f1ef ${proteinPct}% 100%)`,
              }}
            >
              <span className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-5xl">
                {meal.protein}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold">Protein</p>
          </div>

          <div className="text-center">
            <div
              className="mx-auto flex h-40 w-40 items-center justify-center rounded-full text-5xl font-black"
              style={{
                background: `conic-gradient(#46c6a0 ${carbsPct}%, #f0f1ef ${carbsPct}% 100%)`,
              }}
            >
              <span className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-5xl">
                {meal.carbs}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold">Carbs</p>
          </div>

          <div className="text-center">
            <div
              className="mx-auto flex h-40 w-40 items-center justify-center rounded-full text-5xl font-black"
              style={{
                background: `conic-gradient(#ff6464 ${fatPct}%, #f0f1ef ${fatPct}% 100%)`,
              }}
            >
              <span className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-5xl">
                {meal.fat}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold">Fat</p>
          </div>
        </div>
      </section>

      <YouMightAlsoLikeCarousel currentMealSlug={meal.slug} meals={featuredMeals} />
    </div>
  );
}
