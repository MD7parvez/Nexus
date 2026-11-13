"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrototypeOwnerPage() {
  const router = useRouter();
  const [ownerKey, setOwnerKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/auth/prototype-owner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "null", password: "null", age: 0, nid: "null", ownerKey }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to authenticate.");
      setBusy(false);
      return;
    }
    router.push(result.redirectTo ?? "/admin");
  }

  return <div className="flex min-h-[80vh] items-center justify-center p-6">
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/90">
      <CardHeader>
        <CardTitle className="text-center text-2xl">NEXUS prototype owner</CardTitle>
        <p className="text-center text-sm text-slate-400">Owner access for the working prototype</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          <div className="rounded-md border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-300">
            <p>Name: <strong>null</strong></p>
            <p>Password: <strong>null</strong></p>
            <p>Age: <strong>0</strong></p>
            <p>NID: <strong>null</strong></p>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Private owner access key</label>
            <input value={ownerKey} onChange={(event) => setOwnerKey(event.target.value)} type="password" autoComplete="off" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50" required />
          </div>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy || !ownerKey}>{busy ? "Signing in..." : "Open administrator console"}</Button>
        </form>
      </CardContent>
    </Card>
  </div>;
}
