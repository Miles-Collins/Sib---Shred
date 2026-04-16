import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prefer DIRECT_URL for migration workflows, fallback to DATABASE_URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
