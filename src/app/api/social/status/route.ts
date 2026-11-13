import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth-session";
import { getSocialConfig, validPublicProfileUrl } from "@/lib/social/config";

function adultAdminEmails() {
  return (process.env.NEXUS_PUBLISHING_ADULT_ADMIN_EMAILS ?? "")
    .split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
}

export async function GET() {
  const c = getSocialConfig();
  const jar = await cookies();
  const session = verifySession(jar.get("nexus_session")?.value);
  const facebookConfigured = Boolean(
    c.facebook.pageId && c.facebook.token && validPublicProfileUrl(c.facebook.profileUrl)
  );
  const auditConfigured = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const adultAdminAuthorized = Boolean(
    session?.role === "admin" && adultAdminEmails().includes(session.email.toLowerCase())
  );
  return NextResponse.json({
    enabled: c.enabled,
    disclosureConfigured: true,
    maxAccounts: 5,
    facebook: { configured: facebookConfigured, profileUrl: c.facebook.profileUrl },
    x: { configured: Boolean(c.x.token && validPublicProfileUrl(c.x.profileUrl)), profileUrl: c.x.profileUrl },
    livePublishingReady: c.enabled && facebookConfigured && auditConfigured && adultAdminAuthorized,
  }, { headers: { "Cache-Control": "no-store" } });
}
