import { NextResponse } from "next/server";
import { getSocialConfig, validPublicProfileUrl } from "@/lib/social/config";

function adultAdminAllowed() {
  const emails = (process.env.NEXUS_PUBLISHING_ADULT_ADMIN_EMAILS ?? "")
    .split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  return emails.length > 0;
}

export async function GET() {
  const c = getSocialConfig();
  const facebookConfigured = Boolean(
    c.facebook.pageId && c.facebook.token && validPublicProfileUrl(c.facebook.profileUrl)
  );
  const auditConfigured = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  return NextResponse.json({
    enabled: c.enabled,
    disclosureConfigured: true,
    maxAccounts: 5,
    facebook: { configured: facebookConfigured, profileUrl: c.facebook.profileUrl },
    x: { configured: Boolean(c.x.token && validPublicProfileUrl(c.x.profileUrl)), profileUrl: c.x.profileUrl },
    livePublishingReady: c.enabled && facebookConfigured && auditConfigured && adultAdminAllowed(),
  }, { headers: { "Cache-Control": "no-store" } });
}
