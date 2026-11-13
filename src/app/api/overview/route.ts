import { NextResponse } from "next/server";
import { alerts, recentActivity, recentReports } from "@/lib/demo-data";
import { buildOverviewPayload, getAppMode } from "@/lib/app-config";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  if (getAppMode() === "supabase") {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      const payload = buildOverviewPayload({
        investigations: [],
        claims: [],
        narratives: [],
        alerts,
        reports: recentReports,
      });

      return NextResponse.json({ ...payload, recentActivity });
    }

    try {
      const [{ data: investigations = [] }, { data: claims = [] }, { data: narratives = [] }, { data: drafts = [] }] = await Promise.all([
        supabase.from("investigations").select("id,status,priority"),
        supabase.from("claims").select("id,status"),
        supabase.from("narratives").select("id"),
        supabase.from("countermeasure_drafts").select("id,title,body,status"),
      ]);

      const payload = buildOverviewPayload({
        investigations: Array.isArray(investigations) ? investigations : [],
        claims: Array.isArray(claims) ? claims : [],
        narratives: Array.isArray(narratives) ? narratives : [],
        alerts: alerts.slice(0, 3),
        reports: Array.isArray(drafts) ? drafts.map((draft) => ({ id: draft.id, title: draft.title, owner: "Analyst", updated: "Live" })) : recentReports,
      });

      return NextResponse.json({ ...payload, recentActivity });
    } catch {
      const payload = buildOverviewPayload({
        investigations: [],
        claims: [],
        narratives: [],
        alerts,
        reports: recentReports,
      });

      return NextResponse.json({ ...payload, recentActivity });
    }
  }

  const payload = buildOverviewPayload({
    investigations: [],
    claims: [],
    narratives: [],
    alerts,
    reports: recentReports,
  });

  return NextResponse.json({ ...payload, recentActivity });
}
