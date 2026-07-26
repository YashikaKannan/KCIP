import { fetchJson, type ApiResponse } from "@/lib/http";

export type DashboardSummary = {
  todayCases: number;
  openCases: number;
  solvedCases: number;
  pending: number;
  weeklyTrends: Array<{ week: string; cases: number; solved: number }>;
  monthlyTrends: Array<{ month: string; cases: number; solved: number }>;
  casesByDistrict: Array<{ district: string; cases: number }>;
  casesByCrimeHead: Array<{ name: string; value: number }>;
  heatmapData: Array<{ lat: number; lng: number; value: number }>;
  officerPerformance: Array<{ officer: string; solved: number; pending: number }>;
};

export type CaseRecord = {
  id: string;
  title: string;
  district: string;
  category: string;
  status: "Open" | "Under Investigation" | "Closed" | "Pending";
  date: string;
  officer: string;
  station?: string;
  time?: string;
  description?: string;
  victim?: string;
  accused?: string;
  evidence?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
};

export type VictimRecord = {
  id: string;
  name: string;
  age: number;
  gender: string;
  district: string;
  linkedFIR: string;
};

export type AccusedRecord = {
  id: string;
  name: string;
  age: number;
  district: string;
  status: string;
  repeat: boolean;
  linkedFIR?: string;
};

export type EmployeeRecord = {
  id: string;
  name: string;
  district: string;
  station: string;
  rank: string;
  designation: string;
  status: string;
};

export type HotspotRecord = { district: string; risk: number; cases: number; trend: "up" | "down" };
export type AlertRecord = { id: string; title: string; severity: string; district: string; message: string; timestamp: string };
export type PredictionRecord = {
  riskScore: number;
  confidence: number;
  trend: Array<{ week: string; risk: number }>;
  highRiskAreas: Array<{ district: string; score: number }>;
  categoryPrediction: Array<{ category: string; probability: number }>;
};

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  read: boolean;
};

export type HealthServiceRecord = { name: string; status: "healthy" | "warning" | "offline" };

export type BootstrapData = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    district: string;
    designation: string;
    phone: string;
  };
  districts: string[];
  healthServices: HealthServiceRecord[];
  recentCases: CaseRecord[];
  reports: Array<{ id: string; name: string; createdOn: string; by: string; size: string }>;
  notifications: NotificationRecord[];
};

async function unwrap<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  const response = await request;
  return response.data;
}

export const kcipApi = {
  dashboardSummary: () => unwrap(fetchJson<ApiResponse<DashboardSummary>>("/dashboard/summary")),
  dashboardHotspots: () => unwrap(fetchJson<ApiResponse<HotspotRecord[]>>("/dashboard/hotspots")),
  dashboardRecentCases: (limit = 8) => unwrap(fetchJson<ApiResponse<CaseRecord[]>>(`/dashboard/recent-cases?limit=${limit}`)),
  dashboardBootstrap: () => unwrap(fetchJson<ApiResponse<BootstrapData>>("/dashboard/bootstrap")),
  dashboardHealth: () => unwrap(fetchJson<ApiResponse<HealthServiceRecord[]>>("/dashboard/health")),
  cases: () => unwrap(fetchJson<ApiResponse<CaseRecord[]>>("/cases")),
  caseById: (id: string) => unwrap(fetchJson<ApiResponse<CaseRecord>>(`/cases/${encodeURIComponent(id)}`)),
  createCase: (payload: Partial<CaseRecord>) => unwrap(fetchJson<ApiResponse<CaseRecord>>("/cases", {
    method: "POST",
    body: JSON.stringify(payload),
  })),
  updateCase: (id: string, payload: Partial<CaseRecord>) => unwrap(fetchJson<ApiResponse<CaseRecord>>(`/cases/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })),
  deleteCase: (id: string) => unwrap(fetchJson<ApiResponse<{ deleted: boolean }>>(`/cases/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })),
  victims: () => unwrap(fetchJson<ApiResponse<VictimRecord[]>>("/victims")),
  createVictim: (payload: Partial<VictimRecord>) => unwrap(fetchJson<ApiResponse<VictimRecord>>("/victims", {
    method: "POST",
    body: JSON.stringify(payload),
  })),
  accused: () => unwrap(fetchJson<ApiResponse<AccusedRecord[]>>("/accused")),
  createAccused: (payload: Partial<AccusedRecord>) => unwrap(fetchJson<ApiResponse<AccusedRecord>>("/accused", {
    method: "POST",
    body: JSON.stringify(payload),
  })),
  employees: () => unwrap(fetchJson<ApiResponse<EmployeeRecord[]>>("/employees")),
  crimeHeads: () => unwrap(fetchJson<ApiResponse<Array<{ id: string; name: string }>>>("/crime-heads")),
  crimeSubheads: () => unwrap(fetchJson<ApiResponse<Array<{ id: string; headId: string; name: string }>>>("/crime-subheads")),
  policeStations: () => unwrap(fetchJson<ApiResponse<Array<{ id: string; name: string; district: string }>>>("/police-stations")),
  districts: () => unwrap(fetchJson<ApiResponse<string[]>>("/districts")),
  courts: () => unwrap(fetchJson<ApiResponse<string[]>>("/courts")),
  alerts: () => unwrap(fetchJson<ApiResponse<AlertRecord[]>>("/alerts")),
  predictions: () => unwrap(fetchJson<ApiResponse<PredictionRecord>>("/predictions")),
  aiInsights: () => unwrap(fetchJson<ApiResponse<Array<{ title: string; desc: string; confidence: number; type: string }>>>("/ai-insights")),
  notifications: () => unwrap(fetchJson<ApiResponse<NotificationRecord[]>>("/notifications")),
  reports: () => unwrap(fetchJson<ApiResponse<Array<{ id: string; name: string; createdOn: string; by: string; size: string }>>>("/reports")),
  arrests: () => unwrap(fetchJson<ApiResponse<Array<{ id: string; accused: string; fir: string; date: string; officer: string; district: string }>>>("/arrests")),
  chargesheets: () => unwrap(fetchJson<ApiResponse<Array<{ id: string; fir: string; filedOn: string; court: string; status: string }>>>("/charge-sheets")),
  auditLogs: () => unwrap(fetchJson<ApiResponse<Array<{ id: string; user: string; action: string; timestamp: string; severity: string }>>>("/audit-logs")),
  healthServices: () => unwrap(fetchJson<ApiResponse<HealthServiceRecord[]>>("/health-services")),
  graph: () => unwrap(fetchJson<ApiResponse<{ nodes: Array<any>; edges: Array<any> }>>("/graph")),
  currentUser: () => unwrap(fetchJson<ApiResponse<BootstrapData["user"]>>("/auth/me")),
  login: (email: string, password: string) => unwrap(fetchJson<ApiResponse<{ token: string; user: BootstrapData["user"] }>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })),
  logout: () => unwrap(fetchJson<ApiResponse<{ loggedOut: boolean }>>("/auth/logout", {
    method: "POST",
  })),
};
