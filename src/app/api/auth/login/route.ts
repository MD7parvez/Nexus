import { NextResponse } from "next/server";
import { getAppMode } from "@/lib/app-config";
import { getSupabaseAnonClient } from "@/lib/supabase";
import { validateUser } from "@/lib/user-store";

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

  let user: { id: string; email: string; role: string; name: string; age?: number; organization: string } | null = null;
  if (getAppMode() === "supabase") {
    const supabase = getSupabaseAnonClient();
    if (!supabase) return NextResponse.json({ ok: false, error: "Authentication is not configured." }, { status: 500 });
    const { data, error } = await supabase.auth.signInWithPassword({ email: body.email, password: body.password });
    if (error || !data.user) return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    user = {
      id: data.user.id,
      email: data.user.email ?? body.email,
      role: isConfiguredAdmin(data.user.email ?? body.email) ? "admin" : "analyst",
      name: data.user.user_metadata?.display_name ?? "NEXUS User",
      organization: "NEXUS Research Workspace",
    };
  } else {
    user = validateUser(body.email, body.password);
    if (!user) return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    if (isConfiguredAdmin(user.email)) user.role = "admin";
  }

  const response = NextResponse.json({ ok: true, user, mode: getAppMode() });
  response.cookies.set("nexus_session", JSON.stringify(user), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 8,
  });
  return response;
}
