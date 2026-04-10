import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Checkout
        </p>
        <h1 className="mt-1 text-4xl font-black tracking-tight">
          Finish your weekly order
        </h1>
      </header>

      <section className="grid gap-4 rounded-2xl border border-[var(--line)] bg-white p-6">
        <p className="text-sm text-[var(--muted)]">
          This starter page is ready for your checkout form, payment integration,
          and delivery scheduling logic.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
          >
            Back to menu
          </Link>
          <Link
            href="/plans"
            className="rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
          >
            View plans
          </Link>
        </div>
      </section>
    </div>
  );
}
