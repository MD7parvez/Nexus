"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  investigations as seedCases,
  sources as seedSources,
  claims as seedClaims,
  narratives as seedNarratives,
  mediaAssets as seedMedia,
  countermeasures as seedResponses,
  simulationScenarios as seedScenarios,
} from "@/lib/demo-data";

type Tab = "Overview" | "Investigations" | "Sources" | "Claims & narratives" | "Media review" | "Countermeasures" | "Simulation lab" | "Reports";

const tabs: Tab[] = ["Overview", "Investigations", "Sources", "Claims & narratives", "Media review", "Countermeasures", "Simulation lab", "Reports"];

const seed = {
  cases: seedCases as any[],
  sources: seedSources as any[],
  claims: seedClaims as any[],
  narratives: seedNarratives as any[],
  media: seedMedia as any[],
  responses: seedResponses as any[],
  scenarios: seedScenarios as any[],
};

const today = () => new Date().toISOString().slice(0, 10);
const makeId = (prefix: string) => prefix + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();

function Panel({ title, children, action }: { title: string; children: ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-800 bg-slate-900/75 shadow-lg shadow-black/10">
    <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
      <h3 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h3>{action}
    </div>
    <div className="p-5">{children}</div>
  </section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-xs font-medium text-slate-400">{label}{children}</label>;
}

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500";
const buttonClass = "rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-200";
const primaryClass = "rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/25";
const badgeClass = "inline-flex rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300";

export function Workspace({ initialTab = "Overview" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [data, setData] = useState<any>(seed);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [casePriority, setCasePriority] = useState("Medium");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceType, setSourceType] = useState("Public website");
  const [claimText, setClaimText] = useState("");
  const [claimTopic, setClaimTopic] = useState("General");
  const [responseTitle, setResponseTitle] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus-workspace-v1");
      if (saved) setData(JSON.parse(saved));
    } catch {
      setNotice("Local demo data could not be loaded; using sample records.");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem("nexus-workspace-v1", JSON.stringify(data)); }
      catch { setNotice("Browser storage is full. Export your report and clear old demo records."); }
    }
  }, [data, ready]);

  const filteredCases = useMemo(() => data.cases.filter((item: any) => (item.title + " " + item.id + " " + item.status).toLowerCase().includes(search.toLowerCase())), [data.cases, search]);
  const openCases = data.cases.filter((item: any) => !["Closed", "closed"].includes(item.status)).length;
  const underReview = data.claims.filter((item: any) => !["Verified", "verified"].includes(item.status)).length;
  const approved = data.responses.filter((item: any) => ["Approved", "approved"].includes(item.status)).length;
  const topics = Array.from(new Set(data.claims.map((item: any) => item.topic || "Uncategorised")));

  function addCase(event: FormEvent) {
    event.preventDefault();
    if (!caseTitle.trim()) return;
    const item = { id: makeId("INV"), title: caseTitle.trim(), description: caseDescription.trim(), priority: casePriority, status: "Open", assignedAnalyst: "Demo analyst", createdAt: today(), updatedAt: today(), linkedClaims: [], linkedSources: [], linkedMedia: [], notes: "Created in local demo workspace." };
    setData((old: any) => ({ ...old, cases: [item, ...old.cases] }));
    setCaseTitle(""); setCaseDescription(""); setCasePriority("Medium"); setNotice("Investigation created in this browser."); setTab("Investigations");
  }

  function addSource(event: React.FormEvent) {
    event.preventDefault();
    if (!sourceName.trim()) return;
    const item = { id: makeId("SRC"), name: sourceName.trim(), type: sourceType, url: sourceUrl.trim(), dateCollected: today(), publicationDate: "", reliability: "Unassessed", relatedClaims: [], relatedInvestigations: [], provenance: "Added manually; provenance requires analyst review.", analystComments: "" };
    setData((old: any) => ({ ...old, sources: [item, ...old.sources] }));
    setSourceName(""); setSourceUrl(""); setNotice("Source record added."); 
  }

  function addClaim(event: React.FormEvent) {
    event.preventDefault();
    if (!claimText.trim()) return;
    const item = { id: makeId("CLM"), text: claimText.trim(), topic: claimTopic.trim() || "General", confidence: null, status: "Unverified", sources: [], contradictions: [], summary: "Manually entered. No automated truth assessment has been performed." };
    setData((old: any) => ({ ...old, claims: [item, ...old.claims] }));
    setClaimText(""); setNotice("Claim added as unverified; link evidence before assessing it.");
  }

  function addResponse(event: React.FormEvent) {
    event.preventDefault();
    if (!responseTitle.trim() || !responseBody.trim()) return;
    const item = { id: makeId("CM"), title: responseTitle.trim(), body: responseBody.trim(), status: "Draft", evidenceSupport: 0, totalStatements: responseBody.split(/[.!?]+/).filter(Boolean).length, publishedChannel: "Not published" };
    setData((old: any) => ({ ...old, responses: [item, ...old.responses] }));
    setResponseTitle(""); setResponseBody(""); setNotice("Response draft saved. It requires evidence review and human approval.");
  }

  function addScenario(event: React.FormEvent) {
    event.preventDefault();
    if (!scenarioTitle.trim()) return;
    const item = { id: makeId("SIM"), title: scenarioTitle.trim(), difficulty: "Custom", analystScore: null, responseTime: "Not run", status: "Draft", label: "SYNTHETIC SCENARIO" };
    setData((old: any) => ({ ...old, scenarios: [item, ...old.scenarios] }));
    setScenarioTitle(""); setNotice("Fictional scenario created in the isolated demo workspace.");
  }

  async function inspectFile(file?: File) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { setNotice("Demo limit: choose a file smaller than 15 MB."); return; }
    const kind = file.type.startsWith("image/") ? "image" : file.type.startsWith("audio/") ? "audio" : file.type.startsWith("video/") ? "video" : "unsupported";
    if (kind === "unsupported") { setNotice("Choose an image, audio or video file."); return; }
    const bytes = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const hash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    const item = { id: makeId("MED"), filename: file.name, type: kind, size: file.size, hash, status: "Demo metadata review", confidence: null, createdAt: new Date().toISOString(), analysis: "Metadata and hash only. No deepfake detector was run." };
    setData((old: any) => ({ ...old, media: [item, ...old.media] }));
    setNotice("File fingerprint calculated in your browser. The file itself was not uploaded.");
  }

  function updateResponse(id: string, status: string) {
    setData((old: any) => ({ ...old, responses: old.responses.map((item: any) => item.id === id ? { ...item, status } : item) }));
    setNotice("Response status updated. No external post was made.");
  }

  function exportReport() {
    const report = ["NEXUS — Information Integrity Review", "Generated: " + new Date().toLocaleString(), "", "DEMO WORKSPACE — sample and browser-local records only.", "", "INVESTIGATIONS", ...data.cases.map((x: any) => x.id + " | " + x.title + " | " + x.status + " | " + x.priority), "", "CLAIMS", ...data.claims.map((x: any) => x.id + " | " + x.status + " | " + x.text), "", "SOURCES", ...data.sources.map((x: any) => x.id + " | " + x.name + " | " + x.type + " | " + x.url), "", "COUNTERMEASURES", ...data.responses.map((x: any) => x.id + " | " + x.title + " | " + x.status), "", "Limitations: this report contains demo records and analyst-entered material. It is not a verified intelligence assessment."].join("\n");
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "nexus-review-" + today() + ".txt"; link.click(); URL.revokeObjectURL(url);
    setNotice("Report exported as a text file.");
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Demo workspace · local browser storage</p><p className="mt-1 text-xs text-slate-400">Use fictional or non-sensitive public information only. No secure multi-user storage or live platform connections are enabled.</p></div>
      <span className={badgeClass}>Prototype</span>
    </div>

    <div className="flex flex-wrap gap-2">
      {tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={tab === item ? primaryClass : buttonClass}>{item}</button>)}
    </div>

    {notice && <div role="status" className="rounded-lg border border-cyan-500/25 bg-cyan-500/5 px-4 py-3 text-xs text-cyan-100">{notice}<button className="ml-3 text-cyan-300 underline" onClick={() => setNotice("")}>Dismiss</button></div>}

    {tab === "Overview" && <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[["Investigations", data.cases.length], ["Open cases", openCases], ["Claims under review", underReview], ["Approved responses", approved]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-800 bg-slate-900/75 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p></div>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Panel title="Recent investigations" action={<button className={buttonClass} onClick={() => setTab("Investigations")}>View all</button>}>
          <div className="space-y-3">{data.cases.slice(0, 5).map((item: any) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 last:border-0"><div><p className="text-sm font-medium text-slate-100">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.id} · {item.assignedAnalyst || "Unassigned"}</p></div><span className={badgeClass}>{item.status}</span></div>)}</div>
        </Panel>
        <Panel title="Workflow health"><div className="space-y-4 text-sm"><div className="flex justify-between"><span className="text-slate-400">Source records</span><b>{data.sources.length}</b></div><div className="flex justify-between"><span className="text-slate-400">Media fingerprints</span><b>{data.media.length}</b></div><div className="flex justify-between"><span className="text-slate-400">Response drafts</span><b>{data.responses.length}</b></div><div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs leading-5 text-cyan-100">Automated analysis is not active. Human review remains the decision point.</div></div></Panel>
      </div>
    </>}

    {tab === "Investigations" && <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <Panel title="Create investigation"><form onSubmit={addCase} className="space-y-3"><Field label="Title"><input className={inputClass} value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} required placeholder="e.g. Public transport service claim review" /></Field><Field label="Description"><textarea className={inputClass} rows={4} value={caseDescription} onChange={(e) => setCaseDescription(e.target.value)} placeholder="What needs to be checked?" /></Field><Field label="Priority"><select className={inputClass} value={casePriority} onChange={(e) => setCasePriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></Field><button className={primaryClass} type="submit">Create case</button></form></Panel>
      <Panel title="Case register" action={<input className="w-44 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs" placeholder="Search cases" value={search} onChange={(e) => setSearch(e.target.value)} />}><div className="space-y-3">{filteredCases.map((item: any) => <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-[11px] text-slate-500">{item.id} · {item.createdAt}</p></div><span className={badgeClass}>{item.priority}</span></div><p className="mt-2 text-xs text-slate-400">{item.description}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-400">Status: {item.status}</span><select className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs" value={item.status} onChange={(e) => setData((old: any) => ({ ...old, cases: old.cases.map((x: any) => x.id === item.id ? { ...x, status: e.target.value, updatedAt: today() } : x) }))}><option>Open</option><option>Monitoring</option><option>Under Review</option><option>Closed</option></select></div></div>)}</div></Panel>
    </div>}

    {tab === "Sources" && <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><Panel title="Add public source"><form onSubmit={addSource} className="space-y-3"><Field label="Source name"><input className={inputClass} value={sourceName} onChange={(e) => setSourceName(e.target.value)} required /></Field><Field label="Public URL (optional)"><input className={inputClass} type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://" /></Field><Field label="Source type"><select className={inputClass} value={sourceType} onChange={(e) => setSourceType(e.target.value)}><option>Public website</option><option>News</option><option>Official</option><option>Research</option><option>Social post URL</option><option>Other</option></select></Field><button className={primaryClass}>Add source</button></form></Panel><Panel title="Source integrity ledger"><div className="space-y-3">{data.sources.map((item: any) => <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex flex-wrap justify-between gap-2"><b className="text-sm">{item.name}</b><span className={badgeClass}>{item.reliability || "Unassessed"}</span></div><p className="mt-1 text-xs text-slate-500">{item.id} · {item.type}</p>{item.url && <a className="mt-2 block break-all text-xs text-cyan-300 underline" href={item.url} target="_blank" rel="noreferrer">{item.url}</a>}<p className="mt-2 text-xs text-slate-400">{item.provenance || "No provenance notes yet."}</p><p className="mt-2 text-[11px] text-slate-500">Reliability is an analyst assessment, not proof that every claim from this source is true.</p></div>)}</div></Panel></div>}

    {tab === "Claims & narratives" && <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><Panel title="Record a claim"><form onSubmit={addClaim} className="space-y-3"><Field label="Claim text"><textarea className={inputClass} rows={5} value={claimText} onChange={(e) => setClaimText(e.target.value)} required placeholder="Enter a claim exactly as observed..." /></Field><Field label="Topic"><input className={inputClass} value={claimTopic} onChange={(e) => setClaimTopic(e.target.value)} /></Field><button className={primaryClass}>Add as unverified</button><p className="text-[11px] text-slate-500">New claims start unverified. Do not treat disagreement or repetition as proof of manipulation.</p></form></Panel><div className="space-y-5"><Panel title="Narrative groups"><div className="space-y-3">{topics.map((topic: any) => <div key={topic} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3"><div className="flex justify-between"><b className="text-sm">{topic}</b><span className={badgeClass}>{data.claims.filter((x: any) => (x.topic || "Uncategorised") === topic).length} claims</span></div><p className="mt-1 text-xs text-slate-500">Grouping by analyst-entered topic; not an AI conclusion.</p></div>)}</div></Panel><Panel title="Claim register"><div className="space-y-3">{data.claims.map((item: any) => <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex flex-wrap justify-between gap-2"><span className="text-xs text-slate-500">{item.id} · {item.topic}</span><select className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs" value={item.status} onChange={(e) => setData((old: any) => ({ ...old, claims: old.claims.map((x: any) => x.id === item.id ? { ...x, status: e.target.value } : x) }))}><option>Unverified</option><option>Under review</option><option>Verified</option><option>Disputed</option><option>False</option><option>Opinion</option></select></div><p className="mt-2 text-sm text-slate-200">{item.text}</p><p className="mt-2 text-xs text-slate-500">{item.summary || "No analyst summary."}</p></div>)}</div></Panel></div></div>}

    {tab === "Media review" && <div className="space-y-5"><Panel title="Media metadata intake"><div className="flex flex-wrap items-center gap-3"><input type="file" accept="image/*,audio/*,video/*" className="block max-w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:text-slate-200" onChange={(e) => inspectFile(e.target.files?.[0])} /><span className="text-xs text-slate-500">Maximum 15 MB · hash computed locally · file not uploaded</span></div></Panel><Panel title="Media review queue"><div className="space-y-3">{data.media.map((item: any) => <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex flex-wrap justify-between gap-2"><b className="text-sm">{item.filename}</b><span className={badgeClass}>{item.type}</span></div><p className="mt-1 break-all text-[11px] text-slate-500">{item.id} · SHA-256: {item.hash || item.sha256 || "Not recorded"}</p><p className="mt-2 text-xs text-slate-400">{item.analysis || "DEMO RESULT — NOT A REAL FORENSIC VERDICT"}</p><div className="mt-3 rounded border border-amber-500/20 bg-amber-500/5 p-2 text-[10px] font-semibold uppercase tracking-wider text-amber-200">No deepfake model was run. Metadata and hash are not authenticity proof.</div></div>)}</div></Panel></div>}

    {tab === "Countermeasures" && <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><Panel title="Draft defensive response"><form onSubmit={addResponse} className="space-y-3"><Field label="Draft title"><input className={inputClass} value={responseTitle} onChange={(e) => setResponseTitle(e.target.value)} required /></Field><Field label="Response text"><textarea className={inputClass} rows={7} value={responseBody} onChange={(e) => setResponseBody(e.target.value)} required placeholder="Write a correction based on reviewed evidence..." /></Field><button className={primaryClass}>Save draft</button><p className="text-[11px] text-slate-500">NEXUS does not publish to social media. This is a human-reviewed drafting and approval workflow only.</p></form></Panel><Panel title="Approval queue"><div className="space-y-3">{data.responses.map((item: any) => <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex flex-wrap justify-between gap-2"><b className="text-sm">{item.title}</b><span className={badgeClass}>{item.status}</span></div><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-300">{item.body || "Legacy sample response record."}</p><div className="mt-3 flex flex-wrap gap-2">{item.status === "Draft" && <button className={buttonClass} onClick={() => updateResponse(item.id, "Under review")}>Submit for review</button>}{item.status === "Under review" && <button className={primaryClass} onClick={() => updateResponse(item.id, "Approved")}>Approve</button>}{item.status === "Approved" && <button className={buttonClass} onClick={() => updateResponse(item.id, "Monitoring")}>Mark monitoring</button>}</div><p className="mt-2 text-[10px] text-slate-500">Approval records internal review only; no external publication occurs.</p></div>)}</div></Panel></div>}

    {tab === "Simulation lab" && <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><Panel title="Create fictional scenario"><form onSubmit={addScenario} className="space-y-3"><Field label="Scenario title"><input className={inputClass} value={scenarioTitle} onChange={(e) => setScenarioTitle(e.target.value)} required placeholder="e.g. Synthetic emergency bulletin review" /></Field><button className={primaryClass}>Create scenario</button><p className="text-[11px] text-slate-500">Scenarios are fictional, clearly labelled and kept inside this workspace.</p></form></Panel><Panel title="Scenario register"><div className="space-y-3">{data.scenarios.map((item: any) => <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex flex-wrap justify-between gap-2"><b className="text-sm">{item.title}</b><span className={badgeClass}>{item.status}</span></div><p className="mt-2 text-xs text-slate-400">{item.id} · Difficulty: {item.difficulty} · Analyst score: {item.analystScore ?? "Not evaluated"}</p><div className="mt-3 rounded border border-cyan-500/20 bg-cyan-500/5 p-2 text-[10px] font-semibold tracking-wider text-cyan-200">SYNTHETIC SCENARIO — NOT CONNECTED TO LIVE PLATFORMS</div></div>)}</div></Panel></div>}

    {tab === "Reports" && <Panel title="Evidence-linked report export" action={<button className={primaryClass} onClick={exportReport}>Export report (.txt)</button>}><p className="text-sm text-slate-300">Generate a local report containing the current investigation, claim, source and response registers.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{[["Cases", data.cases.length], ["Claims", data.claims.length], ["Sources", data.sources.length]].map(([label, value]) => <div key={String(label)} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}</div><p className="mt-4 text-xs text-slate-500">Reports are marked as demo material and should not be used as operational intelligence.</p></Panel>}
  </div>;
}
