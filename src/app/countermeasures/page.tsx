"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countermeasures } from "@/lib/demo-data";

const defaultDraft = `Emergency officials have confirmed that the agency issued timely public notices. Citizens should rely on verified updates from official channels and avoid spreading unconfirmed rumor cycles.`;

export default function CountermeasuresPage() {
  const [message, setMessage] = useState(defaultDraft);
  const [channels, setChannels] = useState<string[]>(["X", "LinkedIn"]);
  const [status, setStatus] = useState("");

  async function handlePublish() {
    setStatus("Publishing...");

    const response = await fetch("/api/social/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, channels }),
    });

    const result = await response.json();
    setStatus(result.ok ? `Queued for ${result.channels.join(", ")}` : result.error ?? "Unable to publish.");
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Response management</CardTitle>
          <Button variant="default" size="sm">Draft correction</Button>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Approved public correction narrative</p>
              <Badge variant="success">Human approved</Badge>
            </div>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { label: "X", value: "X" },
                { label: "LinkedIn", value: "LinkedIn" },
                { label: "Facebook", value: "Facebook" },
                { label: "Instagram", value: "Instagram" },
              ].map((channel) => (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() => {
                    setChannels((current) =>
                      current.includes(channel.value) ? current.filter((item) => item !== channel.value) : [...current, channel.value],
                    );
                  }}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition",
                    channels.includes(channel.value)
                      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-200"
                      : "border-slate-700 bg-slate-900 text-slate-300",
                  ].join(" ")}
                >
                  {channel.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">{status || "Ready for scheduled distribution"}</span>
              <Button onClick={handlePublish} variant="default" size="sm">
                Publish to channels
              </Button>
            </div>
          </div>

          {countermeasures.map((draft) => (
            <div key={draft.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-50">{draft.title}</p>
                <Badge variant={draft.status === "Approved" ? "success" : draft.status === "Under review" ? "warning" : "default"}>{draft.status}</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-300">
                <div>Evidence support: {draft.evidenceSupport}/{draft.totalStatements}</div>
                <div>Publication route: {draft.publishedChannel}</div>
                <div>Human approval required</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
