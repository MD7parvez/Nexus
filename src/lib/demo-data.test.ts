import { describe, expect, it } from "vitest";
import { getOverviewMetrics, investigations } from "./demo-data";

describe("getOverviewMetrics", () => {
  it("derives counts from the demo investigation records", () => {
    const metrics = getOverviewMetrics();

    expect(metrics.totalInvestigations).toBe(investigations.length);
    expect(metrics.openCases).toBeGreaterThan(0);
    expect(metrics.mediaItemsAwaitingAnalysis).toBeGreaterThan(0);
    expect(metrics.approvedCountermeasures).toBeGreaterThanOrEqual(1);
    expect(metrics.activeNarrativeTrends).toBeGreaterThan(0);
  });
});
