import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth-session";
import { getSupabaseAdminClient } from "@/lib/supabase";
const emptyData = { cases: [], sources: [], claims: [], media: [], responses: [], scenarios: [] };
async function currentUserId() {
 const jar = await cookies();
 const session = verifySession(jar.get("nexus_session")?.value);
 return session?.id || null;
}
export async function GET() {
 const userId = await currentUserId();
 if (!userId) return NextResponse.json({ error: "Sign in to load your workspace." }, { status: 401 });
 const db = getSupabaseAdminClient();
 if (!db) return NextResponse.json({ error: "Supabase database is not connected. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Render." }, { status: 503 });
 const { data, error } = await db.from("workspace_records").select("data").eq("user_id", userId).maybeSingle();
 if (error) return NextResponse.json({ error: "Could not load workspace records. Apply the NEXUS database migration." }, { status: 503 });
 return NextResponse.json({ data: data?.data ?? emptyData }, { headers: { "Cache-Control": "no-store" } });
}
export async function PUT(request: Request) {
 const userId = await currentUserId();
 if (!userId) return NextResponse.json({ error: "Sign in to save your workspace." }, { status: 401 });
 const db = getSupabaseAdminClient();
 if (!db) return NextResponse.json({ error: "Supabase database is not connected. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Render." }, { status: 503 });
 let body: { data?: Record<string, unknown> };
 try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
 if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return NextResponse.json({ error: "Workspace data is required." }, { status: 400 });
 const safeData: Record<string, unknown> = {};
 for (const key of ["cases", "sources", "claims", "media", "responses", "scenarios"]) safeData[key] = Array.isArray(body.data[key]) ? body.data[key] : [];
 const { error } = await db.from("workspace_records").upsert({ user_id: userId, data: safeData, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
 if (error) return NextResponse.json({ error: "Database save failed. Apply the NEXUS database migration." }, { status: 503 });
 return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
