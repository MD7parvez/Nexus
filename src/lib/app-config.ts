export type AppMode = "demo" | "supabase";

export function getAppMode(): AppMode {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  return url && anonKey ? "supabase" : "demo";
}

export function buildOverviewPayload(input: {
  investigations?: Array<{ id?: string; status?: string; priority?: string }>;
  claims?: Array<{ id?: string; status?: string }>;
  narratives?: Array<{ id?: string }>;
  alerts?: Array<{ id?: string; title?: string; severity?: string; source?: string }>;
  reports?: Array<{ id?: string; title?: string; owner?: string; updated?: string }>;
} = {}) {
  const investigations = input.investigations ?? [];
  const claims = input.claims ?? [];
  const narratives = input.narratives ?? [];
  const alerts = input.alerts ?? [];
  const reports = input.reports ?? [];

  const metrics = {
    totalInvestigations: investigations.length,
    openCases: investigations.filter((item) => ["Open", "open", "Monitoring", "monitoring"].includes(String(item.status ?? ""))).length,
    claimsUnderReview: claims.filter((item) => !["Verified", "verified"].includes(String(item.status ?? ""))).length,
    mediaItemsAwaitingAnalysis: Math.max(0, investigations.length - 2),
    activeNarrativeTrends: narratives.length,
    approvedCountermeasures: reports.length > 0 ? 1 : 0,
  };

  return {
    mode: getAppMode(),
    metrics,
    narrativeActivity: [
      { name: "Mon", value: 7 },
      { name: "Tue", value: 14 },
      { name: "Wed", value: 11 },
      { name: "Thu", value: 18 },
      { name: "Fri", value: 23 },
      { name: "Sat", value: 19 },
      { name: "Sun", value: 27 },
    ],
    investigationTimeline: [
      { name: "Jan", investigations: 12, claims: 21 },
      { name: "Feb", investigations: 18, claims: 32 },
      { name: "Mar", investigations: 16, claims: 28 },
      { name: "Apr", investigations: 24, claims: 42 },
      { name: "May", investigations: 19, claims: 31 },
      { name: "Jun", investigations: 21, claims: 44 },
    ],
    priorityDistribution: [
      { name: "Critical", value: 1 },
      { name: "High", value: 2 },
      { name: "Medium", value: 3 },
      { name: "Low", value: 1 },
    ],
    alerts,
    recentActivity: [
      { id: "act-1", analyst: "Alicia Chen", action: "Updated evidence chain for active investigation", time: "12 min ago" },
      { id: "act-2", analyst: "Leah Ortega", action: "Linked new source to narrative cluster", time: "41 min ago" },
      { id: "act-3", analyst: "Noah Patel", action: "Reviewed media provenance metadata", time: "1 hr ago" },
    ],
    reports,
  };
}
