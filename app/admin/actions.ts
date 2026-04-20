"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  canIssueAdminSession,
  createAdminSessionToken,
  getAdminPasscode,
} from "@/lib/admin-auth";

type LoginAttemptState = {
  count: number;
  windowStartMs: number;
  blockedUntilMs: number;
};

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 6;
const BLOCK_DURATION_MS = 15 * 60 * 1000;
const BASE_DELAY_MS = 300;
const MAX_DELAY_MS = 10_000;
const FAILED_LOGIN_BY_IP = new Map<string, LoginAttemptState>();

function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = headersList.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function getAttemptState(ip: string, nowMs: number) {
  const existing = FAILED_LOGIN_BY_IP.get(ip);

  if (!existing || nowMs - existing.windowStartMs > LOGIN_WINDOW_MS) {
    const reset: LoginAttemptState = {
      count: 0,
      windowStartMs: nowMs,
      blockedUntilMs: 0,
    };
    FAILED_LOGIN_BY_IP.set(ip, reset);
    return reset;
  }

  return existing;
}

function getDelayMsForAttemptCount(attemptCount: number) {
  const overLimit = Math.max(0, attemptCount - 1);
  const delay = BASE_DELAY_MS * 2 ** overLimit;
  return Math.min(MAX_DELAY_MS, delay);
}

async function sleepMs(delayMs: number) {
  if (delayMs <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

function pruneRateLimitMap(nowMs: number) {
  if (FAILED_LOGIN_BY_IP.size < 1000) {
    return;
  }

  for (const [key, state] of FAILED_LOGIN_BY_IP.entries()) {
    if (state.blockedUntilMs > nowMs) {
      continue;
    }

    if (nowMs - state.windowStartMs > LOGIN_WINDOW_MS * 2) {
      FAILED_LOGIN_BY_IP.delete(key);
    }
  }
}

export async function loginAdmin(formData: FormData) {
  const passcode = String(formData.get("passcode") || "").trim();
  const next = String(formData.get("next") || "/studio");
  const configuredPasscode = getAdminPasscode();
  const nextPath = next.startsWith("/") ? next : "/studio";
  const requestHeaders = await headers();
  const clientIp = getClientIp(requestHeaders);
  const nowMs = Date.now();
  pruneRateLimitMap(nowMs);

  const state = getAttemptState(clientIp, nowMs);
  if (state.blockedUntilMs > nowMs) {
    const retryAfterMs = state.blockedUntilMs - nowMs;
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    console.warn(`[admin-auth] blocked login attempt from ${clientIp}, retryAfter=${retryAfterSeconds}s`);
    redirect(
      `/admin?error=too-many-attempts&retryAfter=${encodeURIComponent(String(retryAfterSeconds))}&next=${encodeURIComponent(nextPath)}`,
    );
  }

  if (!configuredPasscode) {
    redirect(`/admin?error=missing-passcode&next=${encodeURIComponent(nextPath)}`);
  }

  if (!canIssueAdminSession()) {
    redirect(`/admin?error=missing-session-secret&next=${encodeURIComponent(nextPath)}`);
  }

  if (passcode !== configuredPasscode) {
    state.count += 1;
    if (state.count >= MAX_FAILED_ATTEMPTS) {
      state.blockedUntilMs = nowMs + BLOCK_DURATION_MS;
      FAILED_LOGIN_BY_IP.set(clientIp, state);
      console.warn(`[admin-auth] too many failed login attempts from ${clientIp}; blocked for ${Math.ceil(BLOCK_DURATION_MS / 1000)}s`);
      redirect(`/admin?error=too-many-attempts&retryAfter=${encodeURIComponent(String(Math.ceil(BLOCK_DURATION_MS / 1000)))}&next=${encodeURIComponent(nextPath)}`);
    }

    FAILED_LOGIN_BY_IP.set(clientIp, state);
    await sleepMs(getDelayMsForAttemptCount(state.count));
    console.warn(`[admin-auth] invalid passcode attempt from ${clientIp}; attempt=${state.count}`);
    redirect(`/admin?error=invalid-passcode&next=${encodeURIComponent(nextPath)}`);
  }

  FAILED_LOGIN_BY_IP.delete(clientIp);

  const token = createAdminSessionToken();
  if (!token) {
    redirect(`/admin?error=missing-session-secret&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect(nextPath);
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}
