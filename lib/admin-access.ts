import "server-only";

import { redirect } from "next/navigation";

import { getAuthSession } from "@/auth";
import { getAdminRoleForEmail, roleHasPermission, type AdminPermission, type AdminRoleName } from "@/lib/admin-rbac";

export type AdminActor = {
  email: string;
  role: AdminRoleName;
};

function toSafeNextPath(path: string | undefined) {
  if (!path || !path.startsWith("/")) {
    return "/studio";
  }

  return path;
}

export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await getAuthSession();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) {
    return null;
  }

  const role = await getAdminRoleForEmail(email);
  if (!role) {
    return null;
  }

  return {
    email,
    role,
  };
}

export async function requireAdminPermission(permission: AdminPermission, nextPath?: string) {
  const actor = await getAdminActor();
  const safeNext = toSafeNextPath(nextPath);

  if (!actor) {
    redirect(`/admin?error=auth-required&next=${encodeURIComponent(safeNext)}`);
  }

  if (!roleHasPermission(actor.role, permission)) {
    redirect(`/admin?error=unauthorized&next=${encodeURIComponent(safeNext)}`);
  }

  return actor;
}
