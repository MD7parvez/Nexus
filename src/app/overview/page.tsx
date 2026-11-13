"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowUpRight, CircleDashed, FileText, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { alerts as fallbackAlerts, getOverviewMetrics, investigationTimeline, narrativeActivity, priorityDistribution, recentActivity, recentReports } from "@/lib/demo-data";

const metricConfig = [
  { label: "Total investigations", value: "totalInvestigations", icon: FileText, className: "bg-sky-500/15 text-sky-300" },
  { label: "Open cases", value: "openCases", icon: CircleDashed, className: "bg-cyan-500/15 text-cyan-300" },
  { label: "Claims under review", value: "claimsUnderReview", icon: ShieldCheck, className: "bg-amber-500/15 text-amber-300" },
  { label: "Media items awaiting analysis", value: "mediaItemsAwaitingAnalysis", icon: AlertTriangle, className: "bg-rose-500/15 text-rose-300" },
  { label: "Active narrative trends", value: "activeNarrativeTrends", icon: ArrowUpRight, className: "bg-emerald-500/15 text-emerald-300" },
  { label: "Approved countermeasures", value: "approvedCountermeasures", icon: Users, className: "bg-violet-500/15 text-violet-300" },
];

const pieColors = ["#22d3ee", "#38bdf8", "#fbbf24", "#f87171"];

export default function OverviewPage() {
  const [data, setData] = useState<{
    metrics?: ReturnType<typeof getOverviewMetrics>;
    narrativeActivity?: Array<{ name: string; value: number }>;
    investigationTimeline?: Array<{ name: string; investigations: number; claims: number }>;
    priorityDistribution?: Array<{ name: string; value: number }>;
    alerts?: Array<{ id: string; title: string; severity: string; source: string }>;
    recentActivity?: Array<{ id: string; analyst: string; action: string; time: string }>;
    reports?: Array<{ title: string; owner: string; updated: string }>;
  }>({
    metrics: getOverviewMetrics(),
    narrativeActivity,
    investigationTimeline,
    priorityDistribution,
    alerts: fallbackAlerts,
    recentActivity,
    reports: recentReports,
  });

  useEffect(() => {
    let isMounted = true;

    fetch("/api/overview")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted) return;
        setData({
          metrics: result.metrics ?? getOverviewMetrics(),
          narrativeActivity: result.narrativeActivity ?? narrativeActivity,
          investigationTimeline: result.investigationTimeline ?? investigationTimeline,
          priorityDistribution: result.priorityDistribution ?? priorityDistribution,
          alerts: result.alerts ?? fallbackAlerts,
          recentActivity: result.recentActivity ?? recentActivity,
          reports: result.reports ?? recentReports,
        });
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = data.metrics ?? getOverviewMetrics();
  const narrativeSeries = data.narrativeActivity ?? narrativeActivity;
  const timeline = data.investigationTimeline ?? investigationTimeline;
  const distribution = data.priorityDistribution ?? priorityDistribution;
  const alerts = data.alerts ?? fallbackAlerts;
  const activity = data.recentActivity ?? recentActivity;
  const reports = data.reports ?? recentReports;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metricConfig.map(({ label, value, icon: Icon, className }) => (
          <Card key={label} className="border-slate-800 bg-slate-900/80">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <div className="mt-2 text-3xl font-semibold text-slate-50">{String(metrics[value as keyof typeof metrics])}</div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${className}`}>
                <Icon size={18} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Narrative activity</CardTitle>
            <Badge variant="default">Last 7 days</Badge>
          </CardHeader>
          <CardContent className="h-72 p-4 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={narrativeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Case priority distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72 p-4 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Investigation timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-72 p-4 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="investigations" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="claims" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Recent alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-50">{alert.title}</p>
                  <Badge variant={alert.severity === "High" ? "danger" : alert.severity === "Medium" ? "warning" : "default"}>{alert.severity}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-400">{alert.source}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest reports</CardTitle>
            <Button variant="secondary" size="sm">View archive</Button>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {reports.map((report) => (
              <div key={report.title} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                <div>
                  <p className="font-medium text-slate-50">{report.title}</p>
                  <p className="text-xs text-slate-400">{report.owner}</p>
                </div>
                <span className="text-xs text-slate-400">{report.updated}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Recent analyst activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {activity.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                <p className="text-sm font-medium text-slate-50">{item.analyst}</p>
                <p className="mt-1 text-sm text-slate-300">{item.action}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
