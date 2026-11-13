import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sources } from "@/lib/demo-data";

export default function SourceIntegrityPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle>Source reliability ledger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          {sources.map((source) => (
            <div key={source.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-50">{source.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{source.id}</p>
                </div>
                <Badge variant={source.reliability === "High" ? "success" : source.reliability === "Moderate" ? "warning" : "default"}>{source.reliability}</Badge>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm text-slate-300">
                <div>Type: {source.type}</div>
                <div>URL: {source.url}</div>
                <div>Collected: {source.dateCollected}</div>
                <div>Original publication: {source.publicationDate}</div>
              </div>
              <p className="mt-3 text-sm text-slate-300">Provenance: {source.provenance}</p>
              <p className="mt-2 text-sm text-slate-400">Analyst comments: {source.analystComments}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
