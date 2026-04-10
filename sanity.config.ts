"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { sanityEnv } from "./sanity/env";
import { schema } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: sanityEnv.studioTitle,
  basePath: "/studio",
  projectId: sanityEnv.projectId || "missing-project-id",
  dataset: sanityEnv.dataset,
  schema,
  plugins: [structureTool(), visionTool()],
});
