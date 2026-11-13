import { NextResponse } from "next/server";
import { registerUser } from "@/lib/user-store";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string; age?: number };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (typeof body.name !== "string" || typeof body.email !== "string" || typeof body.password !== "string" || typeof body.age !== "number") {
    return NextResponse.json({ ok: false, error: "Name, email, password and age are required. NID is not collected." }, { status: 400 });
  }
  try {
    const user = registerUser({ name: body.name, email: body.email, password: body.password, age: body.age });
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to create account." }, { status: 400 });
  }
}
