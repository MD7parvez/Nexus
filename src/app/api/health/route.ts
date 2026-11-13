import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: "demo-local-storage",
    service: "NEXUS Information Integrity Workspace",
    timestamp: new Date().toISOString(),
  });
}
