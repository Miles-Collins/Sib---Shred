"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { requireAdminPermission } from "@/lib/admin-access";
import { isAdminRoleName, upsertAdminRole } from "@/lib/admin-rbac";

export async function loginAdmin(formData: FormData) {
  const next = String(formData.get("next") || "/studio");
  const nextPath = next.startsWith("/") ? next : "/studio";
  await signIn("google", { redirectTo: nextPath });
}

export async function logoutAdmin() {
  await signOut({ redirectTo: "/admin" });
}

export async function assignAdminRole(formData: FormData) {
  await requireAdminPermission("admin.roles.manage", "/admin");

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "").trim().toUpperCase();

  if (!email) {
    redirect("/admin?error=missing-role-email");
  }

  if (!isAdminRoleName(role)) {
    redirect("/admin?error=invalid-role");
  }

  await upsertAdminRole(email, role);
  revalidatePath("/admin");
  redirect("/admin?success=role-updated");
}
