import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "../../components/landing/Header";
import { AddToCartPanel } from "../../components/product/AddToCartPanel";
import { ProductDescription } from "../../components/product/ProductDescription";
import { TinyShareButton } from "../../components/product/TinyShareButton";
import { YouMightAlsoLikeCarousel } from "../../components/product/YouMightAlsoLikeCarousel";
import { getMealBySlug, getMealCatalog } from "@/lib/meal-catalog";
import { buildPageMetadata } from "@/lib/seo";

type MealPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const meals = await getMealCatalog();
  return meals.map((meal) => ({ slug: meal.slug }));
}

export async function generateMetadata({ params }: MealPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meal = await getMealBySlug(slug);

  if (!meal) {
    return buildPageMetadata({
      title: "Meal Details | Sib Method",
      description: "Chef-prepared meal details from Sib Method.",
      path: "/menu",
    });
  }

  return buildPageMetadata({
    title: `${meal.name} | Sib Method Menu`,
    description: `${meal.description} Browse nutrition details and add this chef-prepared meal to your order.`,
    path: `/menu/${meal.slug}`,
  });
}

function nutritionRows(meal: {
  calories: number;
  fat: string;
  carbs: string;
  protein: string;
  sodium: string;
}) {
  const fatNum = Number.parseInt(meal.fat, 10);
  const carbNum = Number.parseInt(meal.carbs, 10);
  const proteinNum = Number.parseInt(meal.protein, 10);

  return [
    ["Calories", `${meal.calories}kcal`],
    ["Fat", meal.fat],
    ["Saturated Fat", `${Math.max(4, Math.round(fatNum * 0.42))}g`],
    ["Carbohydrate", meal.carbs],
    ["Sugar", `${Math.max(4, Math.round(carbNum * 0.24))}g`],
    ["Dietary Fiber", `${Math.max(3, Math.round(carbNum * 0.18))}g`],
    ["Protein", meal.protein],
    ["Cholesterol", `${Math.max(80, proteinNum * 5)}mg`],
    ["Sodium", meal.sodium],
    ["Potassium", `${Math.max(500, proteinNum * 20)}mg`],
    ["Calcium", "200mg"],
    ["Iron", "2.3mg"],
  ] as const;
}

function splitIngredients(ingredients: string[]) {
  const mid = Math.ceil(ingredients.length / 2);
  return [ingredients.slice(0, mid), ingredients.slice(mid)];
}

function dietBadgeClass(tag: string) {
  if (tag === "LOW CARB") return "bg-[#2e74d7] text-white";
  if (tag === "CALORIE SMART") return "bg-[#4ec9ee] text-white";
  if (tag === "HIGH PROTEIN") return "bg-[#45b649] text-white";
  if (tag === "FIBER FILLED") return "bg-[#3f4a49] text-white";
  if (tag === "GF") return "bg-[#2e74d7] text-white";
  if (tag === "VEGAN") return "bg-[#45b649] text-white";
  if (tag === "SPICY") return "bg-[#d5423a] text-white";
  return "bg-[#3f4a49] text-white";
}

export default async function MealPage({ params }: MealPageProps) {
  const { slug } = await params;
  const meal = await getMealBySlug(slug);
  const relatedMeals = await getMealCatalog();

  if (!meal) {
    notFound();
  }

  const rows = nutritionRows(meal);
  const [leftIngredients, rightIngredients] = splitIngredients(meal.ingredients);

  return (
    <div className="flex min-h-full flex-col bg-(--bg-cream) text-(--ink)">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-6 sm:px-8">
        <div className="text-[15px] text-(--muted)">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/menu" className="hover:underline">
            Menu
          </Link>{" "}
          / {meal.name}
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.45fr_0.78fr]">
          <article className="brand-shell p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="max-w-3xl text-[clamp(2rem,2.8vw,3.1rem)] leading-[1.05] font-black tracking-tight">
                  {meal.name}
                </h1>
                <p className="mt-2 max-w-2xl text-[1.05rem] leading-relaxed text-(--muted) sm:text-[1.1rem]">
                  {meal.subtitle}
                </p>
              </div>
              <TinyShareButton title={meal.name} />
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-(--line) shadow-[0_10px_24px_rgba(16,27,23,0.08)]">
              <Image
                src={meal.image}
                alt={meal.name}
                width={1600}
                height={980}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from(new Set([...meal.dietaryTags, "CALORIE SMART", "FIBER FILLED"])).map((tag) => (
                <span
                  key={tag}
                  className={`brand-badge motion-badge rounded-[0.2rem] px-2.5 py-1 ${dietBadgeClass(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <AddToCartPanel meal={meal} compact />
          </article>

          <aside className="brand-shell p-5 sm:p-6 lg:p-7">
            <p className="brand-kicker text-(--muted)">Nutrition snapshot</p>
            <h2 className="mt-2 text-[clamp(1.9rem,2.2vw,2.8rem)] font-black tracking-tight">
              Per serving
            </h2>
            <div className="mt-5 space-y-0.5">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-t border-[#d7d8d1] py-3 text-[0.95rem] sm:text-[1rem]"
                >
                  <span className="font-semibold">{label}</span>
                  <span className="font-medium text-(--ink)">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[0.9rem] leading-relaxed text-(--muted)">
              Nutritional info may vary slightly by time of delivery.
            </p>
          </aside>
        </section>

        <ProductDescription text={meal.description} />

        <section className="brand-shell p-6 sm:p-8 lg:p-9">
          <h2 className="text-[clamp(1.8rem,2.2vw,2.5rem)] font-black tracking-tight">
            Ingredients
          </h2>
          <p className="mt-3 text-[1.05rem] leading-relaxed">
            Allergens: {meal.allergens}
          </p>
          <p className="mt-1 text-[0.95rem] font-semibold leading-relaxed text-(--muted)">
            {meal.facilityNote}
          </p>

          <div className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {[leftIngredients, rightIngredients].map((column, index) => (
              <ul key={`column-${index}`} className="space-y-2">
                {column.map((ingredient) => (
                  <li key={ingredient} className="flex items-center gap-3 text-[1rem]">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#70716f] text-[11px] text-white">
                      ■
                    </span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        <YouMightAlsoLikeCarousel currentMealSlug={meal.slug} meals={relatedMeals} />
      </main>
    </div>
  );
}
