import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simulationScenarios } from "@/lib/demo-data";

export default function SimulationLabPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Simulation Lab</CardTitle>
          <Button variant="default" size="sm">Create scenario</Button>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          {simulationScenarios.map((scenario) => (
            <div key={scenario.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-50">{scenario.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{scenario.id}</p>
                </div>
                <Badge variant={scenario.status === "Completed" ? "success" : "warning"}>{scenario.status}</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-300">
                <div>Difficulty: {scenario.difficulty}</div>
                <div>Analyst score: {scenario.analystScore}%</div>
                <div>Response: {scenario.responseTime}</div>
              </div>
              <div className="mt-4 rounded-md border border-cyan-500/30 bg-cyan-500/5 p-3 text-sm text-cyan-100">
                SYNTHETIC SCENARIO — KEPT SEPARATE FROM REAL INVESTIGATIONS
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
