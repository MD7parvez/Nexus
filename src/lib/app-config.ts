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
 return {
  mode: getAppMode(),
  metrics: {
   totalInvestigations: investigations.length,
   openCases: investigations.filter(item => ["Open","open","Monitoring","monitoring"].includes(String(item.status ?? ""))).length,
   claimsUnderReview: claims.filter(item => !["Verified","verified"].includes(String(item.status ?? ""))).length,
   mediaItemsAwaitingAnalysis: 0,
   activeNarrativeTrends: narratives.length,
   approvedCountermeasures: 0,
  },
  narrativeActivity: [],
  investigationTimeline: [],
  priorityDistribution: [],
  alerts,
  recentActivity: [],
  reports,
 };
}
