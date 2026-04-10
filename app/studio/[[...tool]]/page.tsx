import { redirect } from "next/navigation";
import { NextStudio } from "next-sanity/studio";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isSanityConfigured } from "@/sanity/env";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

type StudioPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const params = await searchParams;
  const isAuthed = await isAdminAuthenticated();

  if (!isAuthed) {
    const query = new URLSearchParams();
    query.set("next", "/studio");
    redirect(`/admin?${query.toString()}`);
  }

  if (!isSanityConfigured()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight">Sanity is not configured yet.</h1>
        <p className="text-[var(--muted)]">
          Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to your environment variables,
          then refresh this page.
        </p>
        {Object.keys(params).length > 0 ? (
          <p className="text-xs text-[var(--muted)]">Query params detected and preserved.</p>
        ) : null}
      </main>
    );
  }

  return <NextStudio config={config} />;
}
