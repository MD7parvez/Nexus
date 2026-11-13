import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth-session";
import { getSocialConfig } from "@/lib/social/config";

const DISCLOSURE =
  "RESEARCH ACCOUNT — This post is a clearly labelled research update. It is informational; verify claims against linked sources.";
const GRAPH_API_VERSION = "v27.0";
const MAX_MESSAGE_LENGTH = 4000;

function csvEmails(value: string | undefined) {
  return (value ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
}

function getAuditClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: Request) {
  const jar = await cookies();
  const session = verifySession(jar.get("nexus_session")?.value);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Administrator sign-in required." }, { status: 401 });
  }

  const adultAdmins = csvEmails(process.env.NEXUS_PUBLISHING_ADULT_ADMIN_EMAILS);
  if (!adultAdmins.includes(session.email.toLowerCase())) {
    return NextResponse.json({
      ok: false,
      error: "Publishing access must be authorized by an adult Page administrator for this organization.",
    }, { status: 403 });
  }

  const config = getSocialConfig();
  if (process.env.NEXUS_PUBLISHING_ENABLED !== "true") {
    return NextResponse.json({ ok: false, error: "Live publishing is disabled by the server administrator." }, { status: 403 });
  }
  if (!config.facebook.pageId || !config.facebook.token) {
    return NextResponse.json({ ok: false, error: "The authorized Facebook Page connection is not configured." }, { status: 503 });
  }

  const audit = getAuditClient();
  if (!audit) {
    return NextResponse.json({ ok: false, error: "Persistent audit storage is not configured. No post was sent." }, { status: 503 });
  }

  let body: { requestId?: string; message?: string; confirmPublish?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (body.confirmPublish !== true) {
    return NextResponse.json({ ok: false, error: "Explicit publish confirmation is required." }, { status: 400 });
  }
  if (typeof body.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId)) {
    return NextResponse.json({ ok: false, error: "A unique request ID is required." }, { status: 400 });
  }
  if (typeof body.message !== "string" || !body.message.trim() || body.message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ ok: false, error: "Post text must be between 1 and 4,000 characters." }, { status: 400 });
  }

  const message = body.message.trim();
  if (message.includes(DISCLOSURE)) {
    return NextResponse.json({ ok: false, error: "Do not include the disclosure manually; the server adds it." }, { status: 400 });
  }
  const finalMessage = message + "\n\n" + DISCLOSURE;

  const { error: insertError } = await audit.from("social_publish_audit").insert({
    request_id: body.requestId,
    actor_id: session.id,
    actor_email: session.email,
    platform: "facebook_page",
    page_id: config.facebook.pageId,
    message: finalMessage,
    status: "pending",
  });

  if (insertError) {
    const duplicate = insertError.code === "23505";
    return NextResponse.json({
      ok: false,
      error: duplicate ? "This request ID has already been used. Create a new draft confirmation." : "Could not create the required audit record. No post was sent.",
    }, { status: duplicate ? 409 : 503 });
  }

  let graphResponse: Response;
  try {
    const form = new URLSearchParams({
      message: finalMessage,
      access_token: config.facebook.token,
    });
    graphResponse = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(config.facebook.pageId)}/feed`,
      { method: "POST", body: form, cache: "no-store", signal: AbortSignal.timeout(20000) },
    );
  } catch {
    await audit.from("social_publish_audit").update({
      status: "failed",
      error_code: "network_error",
      completed_at: new Date().toISOString(),
    }).eq("request_id", body.requestId);
    return NextResponse.json({ ok: false, error: "Facebook could not be reached. Check the audit record before retrying." }, { status: 502 });
  }

  let graphBody: { id?: string; error?: { code?: number; message?: string } } = {};
  try {
    graphBody = await graphResponse.json();
  } catch {
    graphBody = {};
  }

  if (!graphResponse.ok || !graphBody.id) {
    const errorCode = graphBody.error?.code ? String(graphBody.error.code) : "facebook_api_error";
    await audit.from("social_publish_audit").update({
      status: "failed",
      error_code: errorCode,
      completed_at: new Date().toISOString(),
    }).eq("request_id", body.requestId);
    return NextResponse.json({
      ok: false,
      error: "Facebook rejected the post. Review Page permissions and the audit entry; do not repeatedly retry.",
      errorCode,
    }, { status: 502 });
  }

  const { error: updateError } = await audit.from("social_publish_audit").update({
    status: "published",
    external_post_id: graphBody.id,
    completed_at: new Date().toISOString(),
  }).eq("request_id", body.requestId);

  if (updateError) {
    return NextResponse.json({
      ok: false,
      published: true,
      auditUpdatePending: true,
      error: "Facebook accepted the post, but the audit status update failed. Do not retry this post.",
      postId: graphBody.id,
    }, { status: 202 });
  }

  return NextResponse.json({ ok: true, published: true, postId: graphBody.id });
}
