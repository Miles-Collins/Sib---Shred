import { createClient } from "next-sanity";

import { isSanityConfigured, sanityEnv } from "../env";

export const sanityClient = createClient({
  projectId: sanityEnv.projectId || "missing-project-id",
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: false,
  perspective: "published",
});

export function canUseSanityClient() {
  return isSanityConfigured();
}
