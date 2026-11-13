import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { claims, narratives } from "@/lib/demo-data";

export default function NarrativeIntelligencePage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Narrative analysis</CardTitle>
          <Button variant="default" size="sm">Extract claims</Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-4 pt-0">
          {narratives.map((narrative) => (
            <div key={narrative.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-50">{narrative.title}</p>
                <Badge variant={narrative.confidence > 0.65 ? "success" : "warning"}>{narrative.status}</Badge>
              </div>
              <p className="mt-3 text-sm text-slate-300">{narrative.summary}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Confidence {narrative.confidence.toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle>Related claims and contradictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          {claims.map((claim) => (
            <div key={claim.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-slate-50">{claim.id}: {claim.text}</p>
                <Badge variant={claim.status === "Verified" ? "success" : claim.status === "Disputed" ? "warning" : "default"}>{claim.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>Topic: {claim.topic}</span>
                <span>•</span>
                <span>Confidence: {claim.confidence.toFixed(2)}</span>
                <span>•</span>
                <span>Sources: {claim.sources.join(", ")}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{claim.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
