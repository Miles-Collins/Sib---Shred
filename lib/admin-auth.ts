import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "sib-method-admin";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  v: 1;
  exp: number;
  nonce: string;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getAdminSessionSecret() {
  const configuredSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (configuredSecret) {
    return configuredSecret;
  }

  // Keep local development ergonomic when only ADMIN_PASSCODE is configured.
  if (process.env.NODE_ENV !== "production") {
    const fallback = process.env.ADMIN_PASSCODE?.trim();
    if (fallback) {
      return `dev-session-secret:${fallback}`;
    }
  }

  return "";
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

  const secret = getAdminSessionSecret();
  if (!secret) {
    return null;
  }

  const expectedSignature = signPayload(payloadBase64, secret);
  if (!safeSignatureMatch(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payloadBase64)) as Partial<AdminSessionPayload>;
    if (parsed.v !== 1 || typeof parsed.exp !== "number" || typeof parsed.nonce !== "string") {
      return null;
    }

    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      v: 1,
      exp: parsed.exp,
      nonce: parsed.nonce,
    };
  } catch {
    return null;
  }
}

export function canIssueAdminSession() {
  return Boolean(getAdminSessionSecret());
}

export function createAdminSessionToken() {
  const secret = getAdminSessionSecret();
  if (!secret) {
    return null;
  }

  const payload: AdminSessionPayload = {
    v: 1,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS,
    nonce: randomBytes(16).toString("hex"),
  };

  const payloadBase64 = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadBase64, secret);
  return `${payloadBase64}.${signature}`;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return parseSessionToken(token) !== null;
}

export function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE || "";
}
