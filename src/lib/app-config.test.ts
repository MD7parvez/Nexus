import { describe, expect, it } from "vitest";
import { buildOverviewPayload, getAppMode } from "./app-config";

describe("app configuration", () => {
  it("uses Supabase mode when the project credentials are configured", () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    try {
      expect(getAppMode()).toBe("supabase");
    } finally {
      if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;

      if (originalAnonKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnonKey;
    }
  });

  it("derives metrics from live investigation records", () => {
    const result = buildOverviewPayload({
      investigations: [
        { id: "inv-1", status: "Open", priority: "High" },
        { id: "inv-2", status: "Monitoring", priority: "Medium" },
        { id: "inv-3", status: "Closed", priority: "Low" },
      ],
      claims: [
        { id: "clm-1", status: "Unverified" },
        { id: "clm-2", status: "Verified" },
      ],
      narratives: [
        { id: "nar-1" },
        { id: "nar-2" },
      ],
      alerts: [
        { id: "alt-1", title: "Alert", severity: "High" },
        { id: "alt-2", title: "Alert 2", severity: "Medium" },
      ],
      reports: [
        { id: "r1", title: "Report A" },
        { id: "r2", title: "Report B" },
      ],
    });

    expect(result.metrics.totalInvestigations).toBe(3);
    expect(result.metrics.openCases).toBe(1);
    expect(result.metrics.claimsUnderReview).toBe(1);
    expect(result.metrics.activeNarrativeTrends).toBe(2);
    expect(result.reports).toHaveLength(2);
  });
});
