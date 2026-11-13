"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [channels, setChannels] = useState<Array<{ name: string; status: string; configured: boolean }>>([]);

  useEffect(() => {
    fetch("/api/social/channels")
      .then((response) => response.json())
      .then((result) => setChannels(result.channels ?? []))
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System configuration</CardTitle>
          <Button variant="secondary" size="sm">Apply updates</Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 p-4 pt-0">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Authentication</p>
            <p className="mt-2 text-lg font-semibold text-slate-50">Supabase Auth</p>
            <p className="mt-2 text-sm text-slate-300">Demo mode is active until environment variables are configured.</p>
            <Badge className="mt-4" variant="warning">Demo mode</Badge>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Database</p>
            <p className="mt-2 text-lg font-semibold text-slate-50">Supabase PostgreSQL</p>
            <p className="mt-2 text-sm text-slate-300">Schema and RLS policies are documented for future production deployment.</p>
            <Badge className="mt-4" variant="default">Schema ready</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle>Social media access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {channels.length === 0 ? (
            <p className="text-sm text-slate-400">No channels configured yet.</p>
          ) : (
            channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                <div>
                  <p className="font-medium text-slate-50">{channel.name}</p>
                  <p className="text-xs text-slate-400">{channel.status}</p>
                </div>
                <Badge variant={channel.configured ? "success" : "warning"}>{channel.configured ? "Connected" : "Pending auth"}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
