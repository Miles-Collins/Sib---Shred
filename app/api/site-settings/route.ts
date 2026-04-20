import { NextResponse } from "next/server";

import { getSiteSettingsFromSanity } from "@/sanity/lib/queries";

export async function GET() {
  const settings = await getSiteSettingsFromSanity();
  return NextResponse.json({ settings });
}
