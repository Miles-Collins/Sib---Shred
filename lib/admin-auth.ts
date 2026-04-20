import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { isAdminSessionJtiRevoked, revokeAdminSessionJti } from "@/lib/admin-security-store";

export const ADMIN_COOKIE_NAME = "sib-method-admin";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  v: 1;
  kid: string;
  jti: string;
  exp: number;
};

type SessionSigningConfig = {
  keys: Map<string, string>;
  activeKeyId: string;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSessionSigningConfig(): SessionSigningConfig {
  const keys = new Map<string, string>();
  const keysEnv = process.env.ADMIN_SESSION_KEYS?.trim();

  if (keysEnv) {
    for (const part of keysEnv.split(",")) {
      const [rawKeyId, ...rawSecretParts] = part.split(":");
      const keyId = rawKeyId?.trim() ?? "";
      const secret = rawSecretParts.join(":").trim();

      if (!keyId || !secret) {
        continue;
      }

      keys.set(keyId, secret);
    }
  }

  const singleSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (singleSecret) {
    keys.set("legacy", singleSecret);
  }

  // Keep local development ergonomic when only ADMIN_PASSCODE is configured.
  if (keys.size === 0 && process.env.NODE_ENV !== "production") {
    const fallback = process.env.ADMIN_PASSCODE?.trim();
    if (fallback) {
      keys.set("dev", `dev-session-secret:${fallback}`);
    }
  }

  const configuredActiveKeyId = process.env.ADMIN_ACTIVE_SESSION_KEY_ID?.trim();
  const firstKeyId = keys.keys().next().value ?? "";
  const activeKeyId =
    configuredActiveKeyId && keys.has(configuredActiveKeyId)
      ? configuredActiveKeyId
      : firstKeyId;

  return {
    keys,
    activeKeyId,
  };
}

function signPayload(payloadBase64: string, secret: string) {
  return createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

function safeSignatureMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function parseSessionToken(token: string): AdminSessionPayload | null {
  const [payloadBase64, signature] = token.split(".");

  if (!payloadBase64 || !signature) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payloadBase64)) as Partial<AdminSessionPayload>;
    if (
      parsed.v !== 1 ||
      typeof parsed.exp !== "number" ||
      typeof parsed.kid !== "string" ||
      typeof parsed.jti !== "string"
    ) {
      return null;
    }

    const { keys } = getSessionSigningConfig();
    const key = keys.get(parsed.kid);
    if (!key) {
      return null;
    }

    const expectedSignature = signPayload(payloadBase64, key);
    if (!safeSignatureMatch(signature, expectedSignature)) {
      return null;
    }

    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      v: 1,
      kid: parsed.kid,
      jti: parsed.jti,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function canIssueAdminSession() {
  const config = getSessionSigningConfig();
  return Boolean(config.activeKeyId && config.keys.get(config.activeKeyId));
}

export function createAdminSessionToken() {
  const config = getSessionSigningConfig();
  const secret = config.keys.get(config.activeKeyId);
  if (!secret || !config.activeKeyId) {
    return null;
  }

  const payload: AdminSessionPayload = {
    v: 1,
    kid: config.activeKeyId,
    jti: randomUUID(),
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS,
  };

  const payloadBase64 = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadBase64, secret);
  return `${payloadBase64}.${signature}`;
}

export async function revokeAdminSessionToken(token: string) {
  const payload = parseSessionToken(token);
  if (!payload) {
    return;
  }

  await revokeAdminSessionJti(payload.jti, payload.exp);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const payload = parseSessionToken(token);
  if (!payload) {
    return false;
  }

  const isRevoked = await isAdminSessionJtiRevoked(payload.jti);
  return !isRevoked;
}

export function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE || "";
}
