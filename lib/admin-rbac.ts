import "server-only";

import type { AdminRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const ADMIN_ROLE_NAMES = ["OWNER", "STAFF", "VIEWER"] as const;

export type AdminRoleName = (typeof ADMIN_ROLE_NAMES)[number];
export type AdminPermission = "admin.access" | "studio.access" | "admin.roles.manage";

const ROLE_PERMISSIONS: Record<AdminRoleName, readonly AdminPermission[]> = {
  // Owner-only access initially. Staff/Viewer are scaffolded for later expansion.
  OWNER: ["admin.access", "studio.access", "admin.roles.manage"],
  STAFF: [],
  VIEWER: [],
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getOwnerBootstrapEmails() {
  const raw = process.env.ADMIN_OWNER_EMAILS ?? "";

  return new Set(
    raw
      .split(",")
      .map((value) => normalizeEmail(value))
      .filter(Boolean),
  );
}

export function isAdminRoleName(value: string): value is AdminRoleName {
  return ADMIN_ROLE_NAMES.includes(value as AdminRoleName);
}

export function roleHasPermission(role: AdminRoleName, permission: AdminPermission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export async function getAdminRoleForEmail(email: string): Promise<AdminRoleName | null> {
  const normalizedEmail = normalizeEmail(email);

  const bootstrapOwners = getOwnerBootstrapEmails();
  if (bootstrapOwners.has(normalizedEmail)) {
    return "OWNER";
  }

  try {
    const existing = await prisma.adminUserRole.findUnique({
      where: { email: normalizedEmail },
      select: { role: true },
    });

    return (existing?.role as AdminRole | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function upsertAdminRole(email: string, role: AdminRoleName) {
  const normalizedEmail = normalizeEmail(email);

  return prisma.adminUserRole.upsert({
    where: { email: normalizedEmail },
    update: { role },
    create: {
      email: normalizedEmail,
      role,
    },
  });
}
