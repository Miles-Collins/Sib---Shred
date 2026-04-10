import Link from "next/link";

export function Hero() {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--hero)] p-8 text-center sm:p-14">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
        Healthy meals delivered
      </p>
      <h1 className="mx-auto mt-3 max-w-3xl text-4xl leading-[1.03] font-black tracking-tight sm:text-6xl">
        Weekly chef-made meal prep built for busy schedules.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
        Order this week&apos;s drop in under five minutes. Macro-friendly,
        portion-controlled, and delivered chilled to your door.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/checkout"
          className="rounded-md bg-[var(--sun)] px-7 py-3 text-sm font-bold uppercase tracking-[0.09em] text-white transition hover:brightness-95"
        >
          Order Now
        </Link>
        <Link
          href="/menu"
          className="rounded-md border border-[var(--ink)] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.09em] transition hover:bg-[var(--ink)] hover:text-white"
        >
          Go to Menu
        </Link>
      </div>

      <div className="mt-9 grid gap-4 text-left md:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            This Week&apos;s Avg Nutrition
          </p>
          <div className="mt-4 flex items-end gap-4">
            <p className="text-4xl font-black">531</p>
            <p className="pb-1 text-sm font-semibold text-[var(--muted)]">
              calories / meal
            </p>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            39g protein • 38g carbs • 20g fat
          </p>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            New Customer Offer
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
            Start with our 5-meal trial and save 15% this week.
          </p>
          <Link
            href="/checkout"
            className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.1em] text-[var(--berry)]"
          >
            Claim offer
          </Link>
        </div>
      </div>
    </section>
  );
}
