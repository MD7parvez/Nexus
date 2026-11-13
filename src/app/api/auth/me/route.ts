import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth-session";

export async function GET() {
  const cookieStore = await cookies();
  const user = verifySession(cookieStore.get("nexus_session")?.value);
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, age: user.age, organization: user.organization } });
}
