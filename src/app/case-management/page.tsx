"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { investigations as fallbackInvestigations } from "@/lib/demo-data";

export default function CaseManagementPage() {
  const [investigations, setInvestigations] = useState(fallbackInvestigations);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/investigations")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted) return;
        if (Array.isArray(result.data) && result.data.length > 0) {
          setInvestigations(result.data);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Case register</CardTitle>
          <Button variant="default" size="sm">New case</Button>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Case ID</th>
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Priority</th>
                  <th className="pb-3 pr-4">Analyst</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {investigations.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800/80">
                    <td className="py-3 pr-4 text-slate-50">{item.id}</td>
                    <td className="py-3 pr-4">{item.title}</td>
                    <td className="py-3 pr-4"><Badge variant={item.priority === "Critical" ? "danger" : item.priority === "High" ? "warning" : "default"}>{item.priority}</Badge></td>
                    <td className="py-3 pr-4">{item.assignedAnalyst}</td>
                    <td className="py-3 pr-4"><Badge variant={item.status === "Open" ? "default" : item.status === "Monitoring" ? "warning" : "success"}>{item.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
