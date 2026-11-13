import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ ok: false, error: "External publishing is disabled in this prototype. NEXUS only supports internal drafts and human approval records." }, { status: 403 }); }
