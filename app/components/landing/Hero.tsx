import Link from "next/link";

export function Hero() {
  return (
    <section className="grain-panel overflow-hidden rounded-3xl border border-[var(--line)] p-7 sm:p-11">
      <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Fresh. Local. Ready in Minutes.
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.02] font-black tracking-tight sm:text-6xl">
            Restaurant-quality meal prep with zero weekday chaos.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Blend the convenience of national meal delivery with the freshness of
            local chef prep. Pick your meals, we cook and deliver, you heat and
            eat.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="rounded-md bg-[var(--sun)] px-7 py-3 text-sm font-bold uppercase tracking-[0.09em] text-white transition hover:brightness-95"
            >
              Choose Meals
            </Link>
            <Link
              href="/plans"
              className="rounded-md border border-[var(--ink)] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.09em] transition hover:bg-[var(--ink)] hover:text-white"
            >
              View Plans
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm font-semibold text-[var(--muted)]">
            <p>100+ weekly options</p>
            <p>Macro-balanced</p>
            <p>No commitment needed</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Popular Tracks
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-[0.1em]">
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
              <p className="text-4xl font-black">531</p>
              <p className="pb-1 text-sm font-semibold text-[var(--muted)]">calories / meal</p>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">39g protein • 38g carbs • 20g fat</p>
          </div>
        </div>
      </div>
    </section>
  );
}
