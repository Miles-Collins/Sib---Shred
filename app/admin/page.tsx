import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "../components/landing/Header";
import { loginAdmin } from "./actions";
import { buildPageMetadata } from "@/lib/seo";

type AdminPageProps = {
  searchParams: Promise<{ next?: string; error?: string; retryAfter?: string }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Access | Sib Method",
  description: "Private admin access for Sib Method content management.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { next, error, retryAfter } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/studio";
  const retryAfterSeconds = Number.parseInt(retryAfter ?? "", 10);
  const retryAfterMessage = Number.isFinite(retryAfterSeconds)
    ? `Please wait about ${Math.max(1, retryAfterSeconds)} seconds before trying again.`
    : "Please wait a few minutes before trying again.";

  const errorMessage =
    error === "missing-passcode"
      ? "ADMIN_PASSCODE is not configured yet."
      : error === "missing-session-secret"
        ? "Admin session signing keys are not configured yet (ADMIN_SESSION_SECRET or ADMIN_SESSION_KEYS)."
        : error === "too-many-attempts"
          ? `Too many login attempts. ${retryAfterMessage}`
      : error === "invalid-passcode"
        ? "Incorrect passcode."
        : "";

  return (
    <div className="flex min-h-full flex-col bg-(--bg-cream) text-(--ink)">
      <Header />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <section className="brand-shell p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--muted)">
            Private admin
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Sanity Studio Access
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--muted) sm:text-base">
            This page is private. Enter your passcode to manage content in the Sanity admin area.
          </p>

          <form action={loginAdmin} className="mt-8 grid gap-4 rounded-2xl border border-(--line) bg-white p-5 sm:p-6">
            <input type="hidden" name="next" value={nextPath} />
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)">
                Passcode
              </span>
              <input
                name="passcode"
                type="password"
                required
                autoComplete="current-password"
                className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) placeholder:text-(--muted) focus:ring-2"
                placeholder="Enter admin passcode"
              />
            </label>

            <button
              type="submit"
              className="brand-control tropical-sheen inline-flex w-full items-center justify-center rounded-full bg-(--sun) px-5 py-3 text-sm font-bold uppercase tracking-widest text-white"
            >
              Enter Studio
            </button>

            <p className="text-xs text-(--muted)">
              Need setup help? Add your Sanity and admin environment variables first.
            </p>

            {errorMessage ? (
              <p className="text-sm font-semibold text-[#a33f35]">{errorMessage}</p>
            ) : null}
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="brand-control rounded-full border border-(--ink) px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
            >
              Back to site
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
