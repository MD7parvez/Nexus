import { NextResponse } from "next/server";
import { getSupabaseAnonClient } from "@/lib/supabase";
import { signSession } from "@/lib/auth-session";

function isConfiguredAdmin(email: string) {
  const allowlist = (process.env.NEXUS_ADMIN_EMAILS ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowlist.includes(email.trim().toLowerCase());
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (typeof body.email !== "string" || typeof body.password !== "string" || !body.email.trim() || !body.password) {
    return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  const supabase = getSupabaseAnonClient();
  if (!supabase) return NextResponse.json({ ok: false, error: "Database is not configured. Ask the project administrator to connect Supabase." }, { status: 503 });
  const { data, error } = await supabase.auth.signInWithPassword({ email: body.email.trim().toLowerCase(), password: body.password });
  if (error || !data.user) return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  const user = {
    id: data.user.id, email: data.user.email ?? body.email,
    role: isConfiguredAdmin(data.user.email ?? body.email) ? "admin" : "analyst",
    name: data.user.user_metadata?.display_name ?? "NEXUS User",
    age: Number(data.user.user_metadata?.age) || undefined,
    organization: "NEXUS Research Workspace",
  };

  let sessionToken: string;
  try { sessionToken = signSession(user); }
  catch { return NextResponse.json({ ok: false, error: "Secure sessions are not configured. The administrator must set NEXUS_SESSION_SECRET." }, { status: 503 }); }
  const response = NextResponse.json({ ok: true, user, mode: getAppMode() });
  response.cookies.set("nexus_session", sessionToken, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 8,
  });
  return response;
}
