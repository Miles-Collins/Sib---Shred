import Link from "next/link";

export function Hero() {
  return (
    <section className="grain-panel overflow-hidden rounded-3xl border border-[var(--line)] p-6 sm:p-10 lg:p-11">
      <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Fresh. Local. Ready in Minutes.
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Restaurant-quality meal prep with zero weekday chaos.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Blend the convenience of national meal delivery with the freshness of
            local chef prep. Pick your meals, I cook and deliver, you heat and
            eat.
          </p>

          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Link
              href="/menu"
              className="brand-control premium-sheen inline-flex justify-center rounded-md bg-[var(--sun)] px-7 py-3 text-sm font-bold uppercase tracking-[0.09em] text-white transition hover:brightness-95 sm:w-auto"
            >
              Choose Meals
            </Link>
            <Link
              href="/plans"
              className="brand-control premium-sheen inline-flex justify-center rounded-md border border-[var(--ink)] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.09em] transition hover:bg-[var(--ink)] hover:text-white sm:w-auto"
            >
              View Plans
            </Link>
          </div>

          <div className="editorial-divider mt-8 rounded-2xl border border-[var(--line)] bg-white/88 p-4 pt-5 sm:max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Founder&apos;s note
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Every menu is curated and packed by Alysha. If it does not taste premium,
              it does not ship.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-white/85 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Options</p>
              <p className="mt-1 text-sm font-semibold text-[var(--ink)]">100+ weekly meals</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/85 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Nutrition</p>
              <p className="mt-1 text-sm font-semibold text-[var(--ink)]">Macro-balanced</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/85 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Flexibility</p>
              <p className="mt-1 text-sm font-semibold text-[var(--ink)]">No commitment</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Popular Tracks
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold uppercase tracking-[0.1em] sm:text-xs">
              <span className="rounded-md bg-[var(--warm)] px-3 py-2 text-center">Under 500</span>
              <span className="rounded-md bg-[var(--warm)] px-3 py-2 text-center">Gluten Free</span>
              <span className="rounded-md bg-[var(--warm)] px-3 py-2 text-center">Low Carb</span>
              <span className="rounded-md bg-[var(--warm)] px-3 py-2 text-center">High Protein</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              This Week&apos;s Avg Nutrition
            </p>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-4xl font-black sm:text-5xl">531</p>
              <p className="pb-1 text-sm font-semibold text-[var(--muted)]">calories / meal</p>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">39g protein • 38g carbs • 20g fat</p>
          </div>
        </div>
      </div>
    </section>
  );
}
