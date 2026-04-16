import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!connectionString) {
    // In some build environments route modules are imported without DB env vars.
    // Return a proxy so import-time evaluation succeeds, and throw only if used.
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error(
          "DATABASE_URL or DIRECT_URL is not set. Configure one before executing Prisma queries.",
        );
      },
    });
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

export const prisma =
  global.prisma ||
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
