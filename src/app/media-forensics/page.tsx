import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mediaAssets } from "@/lib/demo-data";

export default function MediaForensicsPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Media forensics intake</CardTitle>
          <Button variant="default" size="sm">Submit media sample</Button>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          {mediaAssets.map((media) => (
            <div key={media.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-50">{media.filename}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{media.id}</p>
                </div>
                <Badge variant={media.status === "Reviewed" ? "success" : media.status === "Awaiting analysis" ? "warning" : "default"}>{media.status}</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-300">
                <div>Type: {media.type}</div>
                <div>Hash: {media.hash}</div>
                <div>Confidence: {media.confidence.toFixed(2)}</div>
              </div>
              <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-100">
                DEMO RESULT — NOT A REAL FORENSIC VERDICT
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
