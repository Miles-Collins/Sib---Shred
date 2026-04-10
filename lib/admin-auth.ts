import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "sibshred_admin";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1";
}

export function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE || "";
}
