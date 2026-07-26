import { fetchJson, type ApiResponse } from "./api";
import type { BootstrapData, CaseRecord, HealthServiceRecord, HotspotRecord, DashboardSummary } from "./kcip";

export const getDashboardSummary = () => fetchJson<ApiResponse<DashboardSummary>>("/dashboard/summary");
export const getDashboardHotspots = () => fetchJson<ApiResponse<HotspotRecord[]>>("/dashboard/hotspots");
export const getDashboardRecentCases = (limit = 8) => fetchJson<ApiResponse<CaseRecord[]>>(`/dashboard/recent-cases?limit=${limit}`);
export const getDashboardBootstrap = () => fetchJson<ApiResponse<BootstrapData>>("/dashboard/bootstrap");
export const getDashboardHealth = () => fetchJson<ApiResponse<HealthServiceRecord[]>>("/dashboard/health");
export const getDashboard = () => fetchJson<ApiResponse<{
  summary: DashboardSummary;
  hotspots: HotspotRecord[];
  recentCases: CaseRecord[];
  healthServices: HealthServiceRecord[];
  bootstrap: BootstrapData;
}>>("/dashboard");
