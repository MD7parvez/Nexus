import { NextResponse } from "next/server";
import { registerUser } from "@/lib/user-store";
import { getAppMode } from "@/lib/app-config";
import { getSupabaseAnonClient } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string; age?: number };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (typeof body.name !== "string" || typeof body.email !== "string" || typeof body.password !== "string" || typeof body.age !== "number") {
    return NextResponse.json({ ok: false, error: "Name, email, password and age are required. NID is not collected." }, { status: 400 });
  }
  if (!Number.isInteger(body.age) || body.age < 13 || body.age > 120) return NextResponse.json({ ok: false, error: "Enter a valid age between 13 and 120." }, { status: 400 });
  if (body.password.length < 10) return NextResponse.json({ ok: false, error: "Password must be at least 10 characters." }, { status: 400 });
  if (getAppMode() === "supabase") {
    const supabase = getSupabaseAnonClient();
    if (!supabase) return NextResponse.json({ ok: false, error: "Authentication is not configured." }, { status: 500 });
    const { data, error } = await supabase.auth.signUp({ email: body.email, password: body.password, options: { data: { display_name: body.name.trim(), age: body.age } } });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, user: { id: data.user?.id, name: body.name.trim(), email: body.email, age: body.age, role: "analyst" }, message: "Account created. Complete email verification if your organization requires it." }, { status: 201 });
  }
  try {
    const user = registerUser({ name: body.name, email: body.email, password: body.password, age: body.age });
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to create account." }, { status: 400 });
  }
}
