import { NextResponse } from "next/server";
import { getAppMode } from "@/lib/app-config";
import { getSupabaseServerClient } from "@/lib/supabase";
import { investigations } from "@/lib/demo-data";

export async function GET() {
  if (getAppMode() === "supabase") {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ mode: "demo", data: investigations });
    }

    try {
      const { data, error } = await supabase
        .from("investigations")
        .select("id,title,status,priority,assigned_analyst_id,updated_at")
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      const rows = (data ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status,
        priority: item.priority,
        assignedAnalyst: item.assigned_analyst_id ?? "Analyst",
        createdAt: item.updated_at ?? new Date().toISOString(),
        updatedAt: item.updated_at ?? new Date().toISOString(),
      }));

      return NextResponse.json({ mode: "supabase", data: rows.length > 0 ? rows : investigations });
    } catch {
      return NextResponse.json({ mode: "demo", data: investigations });
    }
  }

  return NextResponse.json({ mode: "demo", data: investigations });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedAnalyst?: string;
  };

  if (!body.title) {
    return NextResponse.json({ ok: false, error: "Investigation title is required." }, { status: 400 });
  }

  if (getAppMode() === "supabase") {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase is not configured." }, { status: 500 });
    }

    try {
      const { data, error } = await supabase
        .from("investigations")
        .insert({
          title: body.title,
          description: body.description ?? "Created from NEXUS workflow",
          priority: body.priority ?? "medium",
          status: body.status ?? "open",
          assigned_analyst_id: null,
        })
        .select();

      if (error) {
        throw error;
      }

      const record = {
        id: data?.[0]?.id ?? `INV-${Date.now()}`,
        title: data?.[0]?.title ?? body.title,
        priority: data?.[0]?.priority ?? body.priority ?? "Medium",
        status: data?.[0]?.status ?? body.status ?? "Open",
        assignedAnalyst: body.assignedAnalyst ?? "Analyst",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({ ok: true, data: record, mode: "supabase" });
    } catch {
      const record = {
        id: `INV-${Date.now()}`,
        title: body.title,
        priority: body.priority ?? "Medium",
        status: body.status ?? "Open",
        assignedAnalyst: body.assignedAnalyst ?? "Analyst",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({ ok: true, data: record, mode: "demo" });
    }
  }

  const record = {
    id: `INV-${Date.now()}`,
    title: body.title,
    priority: body.priority ?? "Medium",
    status: body.status ?? "Open",
    assignedAnalyst: body.assignedAnalyst ?? "Analyst",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, data: record, mode: "demo" });
}
