export type CasePriority = "Critical" | "High" | "Medium" | "Low";
export type InvestigationStatus = "Open" | "Monitoring" | "Under Review" | "Closed";
export const investigations: any[] = [];
export const sources: any[] = [];
export const claims: any[] = [];
export const narratives: any[] = [];
export const mediaAssets: any[] = [];
export const countermeasures: any[] = [];
export const simulationScenarios: any[] = [];
export const alerts: any[] = [];
export const recentActivity: any[] = [];
export const recentReports: any[] = [];
export const narrativeActivity: any[] = [];
export const investigationTimeline: any[] = [];
export const priorityDistribution: any[] = [];
export function getOverviewMetrics() { return { totalInvestigations: 0, openCases: 0, claimsUnderReview: 0, mediaItemsAwaitingAnalysis: 0, activeNarrativeTrends: 0, approvedCountermeasures: 0, recentAnalystActivity: 0 }; }
export function getInvestigationTableData() { return investigations; }
export function getNarrativeOverview() { return narratives; }
export function getSourceIntegrityRecords() { return sources; }
export function getSimulatedScenarioRecords() { return simulationScenarios; }
export function getReportList() { return recentReports; }
