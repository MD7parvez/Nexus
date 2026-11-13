import { NextResponse } from "next/server";
import { registerUser } from "@/lib/user-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; password?: string; role?: string };

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ ok: false, error: "Name, email and password are required." }, { status: 400 });
  }

  try {
    const user = registerUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to create account." }, { status: 400 });
  }
}
