import { NextResponse } from "next/server";
import { getSocialConfig, validPublicProfileUrl } from "@/lib/social/config";
export const runtime = "nodejs";
export async function GET() {
  const c = getSocialConfig();
  return NextResponse.json({
    enabled: c.enabled,
    disclosureConfigured: Boolean(c.disclosure),
    maxAccounts: 5,
    facebook: { configured: Boolean(c.facebook.pageId && c.facebook.token && validPublicProfileUrl(c.facebook.profileUrl)), profileUrl: c.facebook.profileUrl },
    x: { configured: Boolean(c.x.token && validPublicProfileUrl(c.x.profileUrl)), profileUrl: c.x.profileUrl },
  });
}
