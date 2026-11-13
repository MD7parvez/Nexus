import { NextResponse } from "next/server";
import { getAppMode } from "@/lib/app-config";
import { getSupabaseAnonClient } from "@/lib/supabase";
import { validateUser } from "@/lib/user-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string; role?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  if (getAppMode() === "supabase") {
    const supabase = getSupabaseAnonClient();

    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase credentials are not configured." }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.user) {
      return NextResponse.json({ ok: false, error: error?.message ?? "Invalid username or password." }, { status: 401 });
    }

    const user = {
      id: data.user.id,
      email: data.user.email ?? body.email,
      role: body.role ?? "analyst",
      name: data.user.user_metadata?.display_name ?? "NEXUS Analyst",
      organization: "Civic Integrity Office",
    };

    const response = NextResponse.json({ ok: true, user, mode: "supabase" });
    response.cookies.set("nexus_session", JSON.stringify(user), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  }

  const user = validateUser(body.email, body.password) ?? {
    id: "demo-user-01",
    email: body.email,
    role: body.role ?? "analyst",
    name: body.email.includes("admin") ? "System Administrator" : "Alicia Chen",
    organization: "Civic Integrity Office",
  };

  const response = NextResponse.json({ ok: true, user, mode: "demo" });
  response.cookies.set("nexus_session", JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
