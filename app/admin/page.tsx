import type { Metadata } from "next";
import Link from "next/link";

import { isGoogleAuthConfigured } from "@/auth";
import { Header } from "../components/landing/Header";
import { getAdminActor } from "@/lib/admin-access";
import { roleHasPermission } from "@/lib/admin-rbac";
import { assignAdminRole, logoutAdmin } from "./actions";
import { buildPageMetadata } from "@/lib/seo";
import { isSanityConfigured } from "@/sanity/env";

type AdminPageProps = {
  searchParams: Promise<{ next?: string; error?: string; success?: string }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Access | Sib Method",
  description: "Private admin access for Sib Method content management.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { next, error, success } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/studio";
  const signInHref = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(nextPath)}`;
  const actor = await getAdminActor();
  const authConfigured = isGoogleAuthConfigured();
  const sanityConfigured = isSanityConfigured();
  const canAccessStudio = actor ? roleHasPermission(actor.role, "studio.access") : false;
  const canManageRoles = actor ? roleHasPermission(actor.role, "admin.roles.manage") : false;

  const errorMessage =
    error === "auth-required"
      ? "Please sign in first."
      : error === "Configuration"
        ? "Auth configuration is invalid. Check AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, and callback URLs."
      : error === "OAuthSignin"
        ? "Could not start Google sign-in. Recheck OAuth client settings and authorized origins."
      : error === "OAuthCallback"
        ? "Google callback failed. Verify authorized redirect URIs and that your account is allowed in OAuth consent settings."
      : error === "OAuthAccountNotLinked"
        ? "This email is already linked with a different sign-in method."
      : error === "AccessDenied"
        ? "Google denied access for this account. Add your email as an OAuth test user if app is in testing mode."
      : error === "unauthorized"
        ? "Your account is signed in but does not have access yet."
      : error === "auth-not-configured"
        ? "Google auth is not configured yet. Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET."
      : error === "missing-role-email"
        ? "Email is required to assign a role."
      : error === "invalid-role"
        ? "Role must be OWNER, STAFF, or VIEWER."
        : "";

  const successMessage = success === "role-updated" ? "Role updated." : "";

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
            Sign in with your approved account to access private admin tools.
          </p>

          <section className="mt-8 grid gap-4 rounded-2xl border border-(--line) bg-white p-5 sm:p-6">
            {!authConfigured ? (
              <p className="text-sm font-semibold text-[#a33f35]">
                Auth.js provider is not configured. Set AUTH_SECRET, AUTH_GOOGLE_ID, and AUTH_GOOGLE_SECRET.
              </p>
            ) : null}

            {!sanityConfigured ? (
              <p className="text-sm font-semibold text-[#a33f35]">
                Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.
              </p>
            ) : null}

            <div className="rounded-xl border border-(--line) bg-(--bg-cream) p-4 text-sm text-(--muted)">
              <p>
                Auth status: <span className="font-bold text-(--ink)">{authConfigured ? "configured" : "missing"}</span>
              </p>
              <p>
                Sanity status: <span className="font-bold text-(--ink)">{sanityConfigured ? "configured" : "missing"}</span>
              </p>
              <p>
                Owner emails configured: <span className="font-bold text-(--ink)">{process.env.ADMIN_OWNER_EMAILS?.trim() ? "yes" : "no"}</span>
              </p>
            </div>

            {!actor ? (
              <div className="grid gap-3">
                {authConfigured ? (
                  <Link
                    href={signInHref}
                    className="brand-control tropical-sheen inline-flex w-full items-center justify-center rounded-full bg-(--sun) px-5 py-3 text-sm font-bold uppercase tracking-widest text-white"
                  >
                    Sign in with Google
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="brand-control tropical-sheen inline-flex w-full items-center justify-center rounded-full bg-(--sun) px-5 py-3 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-50"
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                <p className="text-sm text-(--muted)">
                  Signed in as <span className="font-bold text-(--ink)">{actor.email}</span>
                </p>
                <p className="text-sm text-(--muted)">
                  Role: <span className="font-bold text-(--ink)">{actor.role}</span>
                </p>

                {canAccessStudio ? (
                  <Link
                    href="/studio"
                    className="brand-control tropical-sheen inline-flex w-full items-center justify-center rounded-full bg-(--sun) px-5 py-3 text-sm font-bold uppercase tracking-widest text-white"
                  >
                    Enter Studio
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-[#a33f35]">
                    Your role does not currently include Studio access.
                  </p>
                )}

                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="brand-control inline-flex w-full items-center justify-center rounded-full border border-(--line) px-5 py-3 text-sm font-bold uppercase tracking-widest"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            )}

            {canManageRoles ? (
              <form action={assignAdminRole} className="mt-2 grid gap-3 rounded-xl border border-(--line) bg-(--bg-cream) p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)">Role management (Owner)</p>
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-(--muted)">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2"
                    placeholder="staff@example.com"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-(--muted)">Role</span>
                  <select
                    name="role"
                    defaultValue="VIEWER"
                    className="brand-control rounded-md border border-(--line) bg-white px-3 py-2 text-sm outline-none ring-(--sun) focus:ring-2"
                  >
                    <option value="OWNER">OWNER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="brand-control inline-flex items-center justify-center rounded-full border border-(--ink) px-5 py-2 text-xs font-bold uppercase tracking-[0.08em]"
                >
                  Save role
                </button>
              </form>
            ) : null}

            {errorMessage ? <p className="text-sm font-semibold text-[#a33f35]">{errorMessage}</p> : null}
            {successMessage ? <p className="text-sm font-semibold text-[#216a4a]">{successMessage}</p> : null}
          </section>

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
