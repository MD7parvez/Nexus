"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? "analyst"),
    };

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!registerResponse.ok) {
      const result = await registerResponse.json();
      setError(result.error ?? "Unable to create account.");
      setIsLoading(false);
      return;
    }

    const loginResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        role: payload.role,
      }),
    });

    if (!loginResponse.ok) {
      router.push("/login");
      return;
    }

    router.push("/overview");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create NEXUS account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Full name</label>
              <input name="name" type="text" placeholder="Alicia Chen" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Email</label>
              <input name="email" type="email" placeholder="analyst@agency.gov" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Password</label>
              <input name="password" type="password" placeholder="Create a secure password" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Role</label>
              <select name="role" defaultValue="analyst" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-50 outline-none">
                <option value="analyst">Analyst</option>
                <option value="admin">Administrator</option>
                <option value="editor">Narrative Editor</option>
              </select>
            </div>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <div className="pt-2 text-center text-sm text-slate-300">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-cyan-300 underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
