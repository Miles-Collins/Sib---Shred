"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_COOKIE_NAME, getAdminPasscode } from "@/lib/admin-auth";

export async function loginAdmin(formData: FormData) {
  const passcode = String(formData.get("passcode") || "").trim();
  const next = String(formData.get("next") || "/studio");
  const configuredPasscode = getAdminPasscode();
  const nextPath = next.startsWith("/") ? next : "/studio";

  if (!configuredPasscode) {
    redirect(`/admin?error=missing-passcode&next=${encodeURIComponent(nextPath)}`);
  }

  if (passcode !== configuredPasscode) {
    redirect(`/admin?error=invalid-passcode&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(nextPath);
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}
