"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  canIssueAdminSession,
  createAdminSessionToken,
  getAdminPasscode,
  revokeAdminSessionToken,
} from "@/lib/admin-auth";
import {
  clearFailedAdminLoginAttempts,
  getAdminLoginThrottleState,
  recordFailedAdminLoginAttempt,
} from "@/lib/admin-security-store";

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

async function sleepMs(delayMs: number) {
  if (delayMs <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function loginAdmin(formData: FormData) {
  const passcode = String(formData.get("passcode") || "").trim();
  const next = String(formData.get("next") || "/studio");
  const configuredPasscode = getAdminPasscode();
  const nextPath = next.startsWith("/") ? next : "/studio";
  const requestHeaders = await headers();
  const clientIp = getClientIp(requestHeaders);

  const throttle = await getAdminLoginThrottleState(clientIp);
  if (throttle.blocked) {
    console.warn(`[admin-auth] blocked login attempt from ${clientIp}, retryAfter=${throttle.retryAfterSeconds}s`);
    redirect(
      `/admin?error=too-many-attempts&retryAfter=${encodeURIComponent(String(throttle.retryAfterSeconds))}&next=${encodeURIComponent(nextPath)}`,
    );
  }

  if (!configuredPasscode) {
    redirect(`/admin?error=missing-passcode&next=${encodeURIComponent(nextPath)}`);
  }

  if (!canIssueAdminSession()) {
    redirect(`/admin?error=missing-session-secret&next=${encodeURIComponent(nextPath)}`);
  }

  if (passcode !== configuredPasscode) {
    const failure = await recordFailedAdminLoginAttempt(clientIp);
    if (failure.blocked) {
      console.warn(`[admin-auth] too many failed login attempts from ${clientIp}; blocked for ${failure.retryAfterSeconds}s`);
      redirect(`/admin?error=too-many-attempts&retryAfter=${encodeURIComponent(String(failure.retryAfterSeconds))}&next=${encodeURIComponent(nextPath)}`);
    }

    await sleepMs(failure.delayMs);
    console.warn(`[admin-auth] invalid passcode attempt from ${clientIp}; attempt=${failure.attemptCount}`);
    redirect(`/admin?error=invalid-passcode&next=${encodeURIComponent(nextPath)}`);
  }

  await clearFailedAdminLoginAttempts(clientIp);

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
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (token) {
    await revokeAdminSessionToken(token);
  }

  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}
