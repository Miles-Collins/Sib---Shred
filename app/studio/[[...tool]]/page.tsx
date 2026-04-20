import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";

import { requireAdminPermission } from "@/lib/admin-access";
import { isSanityConfigured } from "@/sanity/env";
import config from "@/sanity.config";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Sanity Studio | Sib Method",
  description: "Private Sanity Studio access for Sib Method content management.",
  path: "/studio",
  noIndex: true,
});

type StudioPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const params = await searchParams;
  await requireAdminPermission("studio.access", "/studio");

  if (!isSanityConfigured()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight">Sanity is not configured yet.</h1>
        <p className="text-(--muted)">
          Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to your environment variables,
          then refresh this page.
        </p>
        {Object.keys(params).length > 0 ? (
          <p className="text-xs text-(--muted)">Query params detected and preserved.</p>
        ) : null}
      </main>
    );
  }

  return <NextStudio config={config} />;
}
