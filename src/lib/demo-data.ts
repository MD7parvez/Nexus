export type CasePriority = "Critical" | "High" | "Medium" | "Low";
export type InvestigationStatus = "Open" | "Monitoring" | "Under Review" | "Closed";

export const investigations = [
  {
    id: "INV-2417",
    title: "Coastal flood alert amplification",
    description:
      "Narrative around emergency response coordination and flood claims spreading faster than verified updates.",
    priority: "High" as CasePriority,
    status: "Open" as InvestigationStatus,
    assignedAnalyst: "Maya Chen",
    createdAt: "2026-11-02",
    updatedAt: "2026-11-12",
    linkedClaims: ["CLM-118", "CLM-122"],
    linkedSources: ["SRC-081", "SRC-096"],
    linkedMedia: ["MED-204"],
    notes: "AI-assisted triage flagged duplicate claims and an unverified rumor cycle.",
  },
  {
    id: "INV-2408",
    title: "Emergency power outage rumor tracker",
    description:
      "A claim that a utility failure was caused by an external actor is being assessed against local reports.",
    priority: "Critical" as CasePriority,
    status: "Monitoring" as InvestigationStatus,
    assignedAnalyst: "Leah Ortega",
    createdAt: "2026-10-28",
    updatedAt: "2026-11-11",
    linkedClaims: ["CLM-101", "CLM-110"],
    linkedSources: ["SRC-022", "SRC-045"],
    linkedMedia: ["MED-178"],
    notes: "Multiple repeated versions were observed but evidence remains mixed.",
  },
  {
    id: "INV-2391",
    title: "Harbor security misinformation review",
    description:
      "Public statements about port security are being compared with official notices and local reporting.",
    priority: "Medium" as CasePriority,
    status: "Under Review" as InvestigationStatus,
    assignedAnalyst: "Noah Patel",
    createdAt: "2026-10-14",
    updatedAt: "2026-11-09",
    linkedClaims: ["CLM-074"],
    linkedSources: ["SRC-031"],
    linkedMedia: ["MED-162"],
    notes: "Only one source corroborates the claim, with uncertainty remaining high.",
  },
  {
    id: "INV-2375",
    title: "Transit service disruption narrative",
    description:
      "Less likely retaliatory narrative near transit disruptions is being tracked for evidence of manipulation.",
    priority: "Low" as CasePriority,
    status: "Closed" as InvestigationStatus,
    assignedAnalyst: "Iris Mendez",
    createdAt: "2026-09-08",
    updatedAt: "2026-11-06",
    linkedClaims: ["CLM-056"],
    linkedSources: ["SRC-010"],
    linkedMedia: ["MED-129"],
    notes: "Closed after a verified public correction was approved and published.",
  },
];

export const sources = [
  {
    id: "SRC-081",
    name: "Harbor Watch Bulletin",
    type: "News",
    url: "https://example.org/harbor-watch",
    dateCollected: "2026-11-12",
    publicationDate: "2026-11-10",
    reliability: "Moderate",
    relatedClaims: ["CLM-118"],
    relatedInvestigations: ["INV-2417"],
    provenance: "Archived and cross-checked against official advisories.",
    analystComments: "Material cites emergency channels but not direct counts.",
  },
  {
    id: "SRC-096",
    name: "Regional emergency office",
    type: "Official",
    url: "https://example.org/emergency-office",
    dateCollected: "2026-11-12",
    publicationDate: "2026-11-09",
    reliability: "High",
    relatedClaims: ["CLM-122"],
    relatedInvestigations: ["INV-2417"],
    provenance: "Issued by verified municipal authority.",
    analystComments: "Direct agency update, no evidence of fabrication observed.",
  },
  {
    id: "SRC-022",
    name: "Independent outage map",
    type: "Open Source",
    url: "https://example.org/outage-map",
    dateCollected: "2026-11-08",
    publicationDate: "2026-11-07",
    reliability: "Low",
    relatedClaims: ["CLM-101"],
    relatedInvestigations: ["INV-2408"],
    provenance: "Third-party aggregation; provenance details limited.",
    analystComments: "Useful for trend detection but not direct evidence of causality.",
  },
];

export const claims = [
  {
    id: "CLM-118",
    text: "Emergency officials knowingly failed to warn residents before the flood barrier breach.",
    topic: "Emergency communications",
    confidence: 0.61,
    status: "Unverified",
    sources: ["SRC-081"],
    contradictions: ["CLM-122"],
    summary: "The claim cites delayed warning timelines but relies partly on anecdotal reporting.",
  },
  {
    id: "CLM-122",
    text: "Emergency notices were issued before the flood barrier breach, according to official timelines.",
    topic: "Emergency communications",
    confidence: 0.89,
    status: "Verified",
    sources: ["SRC-096"],
    contradictions: ["CLM-118"],
    summary: "Verified with official timeline data and forwarded agency notices.",
  },
  {
    id: "CLM-101",
    text: "A foreign actor intentionally triggered a grid outage to manipulate public trust.",
    topic: "Infrastructure disruption",
    confidence: 0.33,
    status: "Unverified",
    sources: ["SRC-022"],
    contradictions: [],
    summary: "Claim is speculative and not supported by direct evidence in the current record set.",
  },
  {
    id: "CLM-074",
    text: "The harbor security crackdown was directly ordered by a political figure.",
    topic: "Security operations",
    confidence: 0.52,
    status: "Disputed",
    sources: ["SRC-031"],
    contradictions: ["CLM-090"],
    summary: "Public comments conflict with statements from official security channels.",
  },
];

export const narratives = [
  {
    id: "NAR-11",
    title: "Flood response coordination narrative",
    summary: "Amplified claims about delayed warnings took hold after local media recirculated fragmented updates.",
    status: "Monitoring",
    relatedClaims: ["CLM-118", "CLM-122"],
    confidence: 0.72,
  },
  {
    id: "NAR-15",
    title: "Utility failure attribution narrative",
    summary: "A narrative blaming a specific actor is being tracked but remains unsupported by direct evidence.",
    status: "Under Review",
    relatedClaims: ["CLM-101"],
    confidence: 0.44,
  },
  {
    id: "NAR-19",
    title: "Port security accountability narrative",
    summary: "Claims about political directives are disputed between public comments and official statements.",
    status: "Evidence review",
    relatedClaims: ["CLM-074"],
    confidence: 0.57,
  },
];

export const mediaAssets = [
  { id: "MED-204", filename: "flood-briefing.mp4", type: "video", status: "Awaiting analysis", hash: "b7ce2fe1a4d6", confidence: 0.57 },
  { id: "MED-178", filename: "outage-audio.wav", type: "audio", status: "Simulated review", hash: "fe4dd81209af", confidence: 0.41 },
  { id: "MED-162", filename: "harbor-photo.jpg", type: "image", status: "Reviewed", hash: "6dc2ce77c9af", confidence: 0.8 },
];

export const countermeasures = [
  {
    id: "CM-101",
    title: "Flood warning correction draft",
    status: "Approved",
    evidenceSupport: 9,
    totalStatements: 11,
    publishedChannel: "Municipal portal",
  },
  {
    id: "CM-110",
    title: "Utility outage briefing",
    status: "Under review",
    evidenceSupport: 4,
    totalStatements: 7,
    publishedChannel: "Internal bulletin",
  },
  {
    id: "CM-122",
    title: "Port policy advisory",
    status: "Draft",
    evidenceSupport: 2,
    totalStatements: 6,
    publishedChannel: "Awaiting approval",
  },
];

export const simulationScenarios = [
  {
    id: "SIM-14",
    title: "Public health alert spoofing",
    difficulty: "Advanced",
    analystScore: 86,
    responseTime: "02:40",
    status: "Completed",
  },
  {
    id: "SIM-18",
    title: "Infrastructure rumor cascade",
    difficulty: "Moderate",
    analystScore: 71,
    responseTime: "03:16",
    status: "In progress",
  },
];

export const alerts = [
  { id: "ALT-441", title: "Duplicate rumor loop detected in flood rescue threads", severity: "High", source: "Cross-post monitoring" },
  { id: "ALT-439", title: "Official update contradicts rumor about emergency channels", severity: "Medium", source: "Source integrity watch" },
  { id: "ALT-433", title: "Synthetic media sample triggered simulation review queue", severity: "Low", source: "Media forensics" },
];

export const recentActivity = [
  { id: "ACT-22", analyst: "Maya Chen", action: "Linked new source to flood narrative", time: "12 min ago" },
  { id: "ACT-21", analyst: "Leah Ortega", action: "Updated evidence chain for outage rumor", time: "41 min ago" },
  { id: "ACT-18", analyst: "Noah Patel", action: "Reviewed media provenance metadata", time: "1 hr ago" },
  { id: "ACT-16", analyst: "Iris Mendez", action: "Approved public correction draft", time: "3 hrs ago" },
];

export const recentReports = [
  { title: "Week 46 incident briefing", owner: "Maya Chen", updated: "2 hrs ago" },
  { title: "Narrative drift assessment", owner: "Leah Ortega", updated: "Yesterday" },
  { title: "Media provenance review", owner: "Noah Patel", updated: "2 days ago" },
];

export const narrativeActivity = [
  { name: "Mon", value: 14 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 12 },
  { name: "Thu", value: 21 },
  { name: "Fri", value: 24 },
  { name: "Sat", value: 19 },
  { name: "Sun", value: 27 },
];

export const investigationTimeline = [
  { name: "Jan", investigations: 5, claims: 18 },
  { name: "Feb", investigations: 8, claims: 23 },
  { name: "Mar", investigations: 11, claims: 28 },
  { name: "Apr", investigations: 9, claims: 26 },
  { name: "May", investigations: 13, claims: 31 },
  { name: "Jun", investigations: 18, claims: 43 },
];

export const priorityDistribution = [
  { name: "Critical", value: 2 },
  { name: "High", value: 5 },
  { name: "Medium", value: 8 },
  { name: "Low", value: 4 },
];

export function getOverviewMetrics() {
  return {
    totalInvestigations: investigations.length,
    openCases: investigations.filter((item) => item.status === "Open").length,
    claimsUnderReview: claims.filter((item) => item.status !== "Verified").length,
    mediaItemsAwaitingAnalysis: mediaAssets.filter((item) => item.status !== "Reviewed").length,
    activeNarrativeTrends: narratives.length,
    approvedCountermeasures: countermeasures.filter((item) => item.status === "Approved").length,
    recentAnalystActivity: recentActivity.length,
  };
}

export function getInvestigationTableData() {
  return investigations;
}

export function getNarrativeOverview() {
  return narratives;
}

export function getSourceIntegrityRecords() {
  return sources;
}

export function getSimulatedScenarioRecords() {
  return simulationScenarios;
}

export function getReportList() {
  return recentReports;
}
