import Link from "next/link";

import { Header } from "../components/landing/Header";
import { loginAdmin } from "./actions";

type AdminPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { next, error } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/studio";

  const errorMessage =
    error === "missing-passcode"
      ? "ADMIN_PASSCODE is not configured yet."
      : error === "invalid-passcode"
        ? "Incorrect passcode."
        : "";

  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <section className="brand-shell p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Private admin
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Sanity Studio Access
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            This page is private. Enter your passcode to manage content in the Sanity admin area.
          </p>

          <form action={loginAdmin} className="mt-8 grid gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6">
            <input type="hidden" name="next" value={nextPath} />
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Passcode
              </span>
              <input
                name="passcode"
                type="password"
                required
                autoComplete="current-password"
                className="brand-control rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[var(--sun)] placeholder:text-[var(--muted)] focus:ring-2"
                placeholder="Enter admin passcode"
              />
            </label>

            <button
              type="submit"
              className="brand-control premium-sheen inline-flex w-full items-center justify-center rounded-full bg-[var(--sun)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white"
            >
              Enter Studio
            </button>

            <p className="text-xs text-[var(--muted)]">
              Need setup help? Add your Sanity and admin environment variables first.
            </p>

            {errorMessage ? (
              <p className="text-sm font-semibold text-[#a33f35]">{errorMessage}</p>
            ) : null}
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="brand-control rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
            >
              Back to site
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
