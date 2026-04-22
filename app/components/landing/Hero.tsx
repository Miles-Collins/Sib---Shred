import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="apple-hero-surface tablet-hero-shell relative overflow-hidden rounded-3xl border p-6 sm:p-10 lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#77bddb]/30 blur-3xl sm:h-72 sm:w-72"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-[#0a7d95]/18 blur-3xl sm:h-72 sm:w-72"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-(--line) bg-white/78 px-3 py-1 text-[9px] font-bold tracking-[0.17em] uppercase text-(--muted) sm:text-[10px]">
            Tropical Luxury Meal Prep
          </span>
          <h1 className="tablet-hero-title mt-4 max-w-3xl text-[2.3rem] font-black leading-[1.02] tracking-[-0.03em] sm:text-[3.4rem] lg:text-[4.15rem]">
            Food that keeps up.
            <span className="mt-1 block text-[0.88em] text-(--muted)">Chef-level meals, delivered weekly.</span>
          </h1>
          <p className="tablet-readable mt-5 max-w-xl text-[1rem] leading-relaxed text-(--muted) sm:text-lg">
            Built for high performers who want clean macros and restaurant-grade flavor without
            the kitchen time sink.
          </p>

          <div className="mt-7 grid gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/menu"
              className="apple-button-primary inline-flex w-full justify-center rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.11em] text-white sm:w-auto sm:py-3 sm:text-sm"
            >
              Choose Meals
            </Link>
            <Link
              href="/plans"
              className="apple-button-secondary inline-flex w-full justify-center rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.11em] sm:w-auto sm:py-3 sm:text-sm"
            >
              View Plans
            </Link>
          </div>

          <div className="mt-8 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
            <div className="rounded-2xl border border-(--line) bg-white/85 px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--muted)">Weekly Menu</p>
              <p className="mt-1 text-sm font-semibold text-(--ink)">100+ options</p>
            </div>
            <div className="rounded-2xl border border-(--line) bg-white/85 px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--muted)">Nutrition</p>
              <p className="mt-1 text-sm font-semibold text-(--ink)">Macro-balanced</p>
            </div>
            <div className="rounded-2xl border border-(--line) bg-white/85 px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--muted)">Flexibility</p>
              <p className="mt-1 text-sm font-semibold text-(--ink)">No commitment</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="apple-hero-media relative overflow-hidden rounded-4xl border border-[#d8e7ee] bg-[linear-gradient(165deg,#ffffff,#eef8fb)] p-2 shadow-[0_30px_80px_rgba(10,45,57,0.16)]">
            <div className="relative h-85 overflow-hidden rounded-[1.65rem] sm:h-108">
              <Image
                src="/alysha-portrait.png"
                alt="Alysha plating premium meal prep"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 44vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,24,29,0)_38%,rgba(4,24,29,0.5)_100%)]" />
            </div>

            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/25 bg-[#072734]/82 px-4 py-3 text-white backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/75">Founder-crafted</p>
              <p className="mt-1 text-base font-semibold leading-tight">Prepared by Alysha</p>
            </div>
          </div>

          <div className="absolute -left-3 top-6 rounded-2xl border border-[#d8e7ee] bg-white/92 px-3 py-2.5 shadow-[0_10px_24px_rgba(10,45,57,0.13)] sm:-left-4 sm:px-4 sm:py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--muted)">Delivery rhythm</p>
            <p className="mt-1 text-sm font-semibold text-(--ink)">Weekly fresh drops</p>
          </div>

          <div className="absolute -right-2 bottom-8 rounded-2xl border border-[#d8e7ee] bg-white/92 px-3 py-2.5 shadow-[0_10px_24px_rgba(10,45,57,0.13)] sm:-right-3 sm:px-4 sm:py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-(--muted)">Avg macros</p>
            <p className="mt-1 text-sm font-semibold text-(--ink)">39g protein</p>
            </div>
        </div>
      </div>
    </section>
  );
}

