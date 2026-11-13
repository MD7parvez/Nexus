import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({
    ok: false,
    error: "Live social publishing is disabled in this prototype. Secure server-side authentication, reviewer authorization, durable audit logging, and approved platform credentials are required first."
  }, { status: 403 });
}
