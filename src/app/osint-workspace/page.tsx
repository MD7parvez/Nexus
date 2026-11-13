import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { investigations, sources } from "@/lib/demo-data";

export default function OsintWorkspacePage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Investigation workspace</CardTitle>
          <Button variant="default" size="sm">New source record</Button>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Date</label>
              <div className="mt-2 text-sm text-slate-100">2026-11-12</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Source type</label>
              <div className="mt-2 text-sm text-slate-100">News / Official</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Status</label>
              <div className="mt-2 text-sm text-slate-100">Open</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Priority</label>
              <div className="mt-2 text-sm text-slate-100">High</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Analyst</label>
              <div className="mt-2 text-sm text-slate-100">Maya Chen</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Active investigations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            {investigations.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-50">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.id}</p>
                  </div>
                  <Badge variant={item.priority === "Critical" ? "danger" : item.priority === "High" ? "warning" : "default"}>{item.priority}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>Assigned: {item.assignedAnalyst}</span>
                  <span>•</span>
                  <span>Status: {item.status}</span>
                  <span>•</span>
                  <span>Updated: {item.updatedAt}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Source records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {sources.map((source) => (
              <div key={source.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-slate-50">{source.name}</p>
                  <Badge variant={source.reliability === "High" ? "success" : source.reliability === "Moderate" ? "warning" : "default"}>{source.reliability}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-400">{source.type} • {source.publicationDate}</p>
                <p className="mt-2 text-sm text-slate-300">{source.provenance}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
