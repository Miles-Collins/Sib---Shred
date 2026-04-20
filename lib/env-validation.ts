declare global {
  // Prevent duplicate validation in dev reloads and across module imports.
  var __sibMethodEnvValidated: boolean | undefined;
  var __sibMethodEnvWarnedMissingSslMode: boolean | undefined;
}

function isBlank(value: string | undefined) {
  return !value || value.trim().length === 0;
}

function isPostgresUrl(value: string) {
  return value.startsWith("postgres://") || value.startsWith("postgresql://");
}

function validateHttpUrl(name: string, value: string, errors: string[]) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      errors.push(`${name} must use http:// or https://.`);
    }
  } catch {
    errors.push(`${name} is not a valid URL.`);
  }
}

function validatePostgresUrl(name: string, value: string, errors: string[]) {
  if (!isPostgresUrl(value)) {
    errors.push(`${name} must start with postgresql:// or postgres://.`);
    return;
  }

  try {
    // URL parsing also verifies basic shape (host/user/path).
    new URL(value);
  } catch {
    errors.push(`${name} is not a valid Postgres connection string.`);
    return;
  }

  if (!/sslmode=require/i.test(value) && !global.__sibMethodEnvWarnedMissingSslMode) {
    // Keep this as a warning so build/import-time evaluation is not blocked.
    console.warn(`${name} should include sslmode=require for secure DB connections.`);
    global.__sibMethodEnvWarnedMissingSslMode = true;
  }
}

export function validateRuntimeEnv() {
  if (global.__sibMethodEnvValidated) {
    return;
  }

  const errors: string[] = [];
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const isProd = nodeEnv === "production";
  const isProductionBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  const redisUrl = process.env.REDIS_URL;
  const adminPasscode = process.env.ADMIN_PASSCODE;
  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;
  const adminSessionKeys = process.env.ADMIN_SESSION_KEYS;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

  if (!isBlank(databaseUrl ?? undefined)) {
    validatePostgresUrl("DATABASE_URL", databaseUrl as string, errors);
  }

  if (!isBlank(directUrl ?? undefined)) {
    validatePostgresUrl("DIRECT_URL", directUrl as string, errors);
  }

  if (isProd && !isProductionBuildPhase && isBlank(databaseUrl) && isBlank(directUrl)) {
    errors.push("Set DATABASE_URL or DIRECT_URL in production.");
  }

  if (isProd && !isProductionBuildPhase && isBlank(adminPasscode)) {
    errors.push("ADMIN_PASSCODE is required in production.");
  }

  if (isProd && !isProductionBuildPhase && isBlank(redisUrl)) {
    errors.push("REDIS_URL is required in production for distributed admin security controls.");
  }

  if (isProd && !isProductionBuildPhase && isBlank(adminSessionSecret) && isBlank(adminSessionKeys)) {
    errors.push("Set ADMIN_SESSION_SECRET or ADMIN_SESSION_KEYS in production.");
  }

  if (!isBlank(siteUrl)) {
    validateHttpUrl("NEXT_PUBLIC_SITE_URL", siteUrl as string, errors);
  }

  if (!isBlank(sanityApiVersion) && !/^\d{4}-\d{2}-\d{2}$/.test(sanityApiVersion as string)) {
    errors.push("NEXT_PUBLIC_SANITY_API_VERSION must be in YYYY-MM-DD format.");
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n- ${errors.join("\n- ")}`);
  }

  global.__sibMethodEnvValidated = true;
}
