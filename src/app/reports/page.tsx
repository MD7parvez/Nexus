import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentReports } from "@/lib/demo-data";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle>Report generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          {recentReports.map((report) => (
            <div key={report.title} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-50">{report.title}</p>
                  <p className="text-sm text-slate-400">Owner: {report.owner}</p>
                </div>
                <Badge variant="default">Ready</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-slate-300">
                <div>Executive summary included</div>
                <div>Updated {report.updated}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
