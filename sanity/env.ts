const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-10";

export const sanityEnv = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion,
  studioTitle: process.env.NEXT_PUBLIC_SANITY_STUDIO_TITLE || "Sib Method CMS",
};

export function isSanityConfigured() {
  return Boolean(sanityEnv.projectId && sanityEnv.dataset);
}
