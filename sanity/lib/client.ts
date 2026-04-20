import "server-only";

import { createClient } from "next-sanity";

import { isSanityConfigured, sanityEnv } from "../env";

const sanityApiToken = process.env.SANITY_API_TOKEN?.trim() || undefined;

export const sanityClient = createClient({
  projectId: sanityEnv.projectId || "nd3npka5",
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: false,
  perspective: "published",
  token: sanityApiToken,
});

export function canUseSanityClient() {
  return isSanityConfigured();
}
