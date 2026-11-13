import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { signSession } from "@/lib/auth-session";

function matchesSecret(candidate: string, configured: string) {
  const a = Buffer.from(candidate);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  let body: { name?: string; password?: string; age?: number; nid?: string; ownerKey?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }

  const configuredKey = process.env.NEXUS_PROTOTYPE_OWNER_KEY;
  if (!configuredKey || configuredKey.length < 32) {
    return NextResponse.json({ ok: false, error: "Prototype owner access is not configured." }, { status: 503 });
  }

  if (
    body.name !== "null" ||
    body.password !== "null" ||
    body.age !== 0 ||
    body.nid !== "null" ||
    typeof body.ownerKey !== "string" ||
    !matchesSecret(body.ownerKey, configuredKey)
  ) {
    return NextResponse.json({ ok: false, error: "Prototype owner credentials are invalid." }, { status: 401 });
  }

  let token: string;
  try {
    token = signSession({
      id: "nexus-prototype-owner",
      email: "prototype-owner@nexus.local",
      role: "admin",
      name: "Prototype Owner",
      age: 0,
      organization: "NEXUS Prototype",
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Secure sessions are not configured." }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true, redirectTo: "/admin" });
  response.cookies.set("nexus_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
