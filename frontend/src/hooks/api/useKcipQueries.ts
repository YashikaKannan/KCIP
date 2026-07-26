import { useMutation, useQuery } from "@tanstack/react-query";
import { kcipApi } from "@/api/kcip";

export const kcipKeys = {
  dashboard: {
    summary: ["dashboard", "summary"] as const,
    hotspots: ["dashboard", "hotspots"] as const,
    recentCases: ["dashboard", "recentCases"] as const,
    bootstrap: ["dashboard", "bootstrap"] as const,
    health: ["dashboard", "health"] as const,
  },
  cases: ["cases"] as const,
  victims: ["victims"] as const,
  accused: ["accused"] as const,
  employees: ["employees"] as const,
  masters: {
    crimeHeads: ["crimeHeads"] as const,
    crimeSubheads: ["crimeSubheads"] as const,
    policeStations: ["policeStations"] as const,
    districts: ["districts"] as const,
    courts: ["courts"] as const,
  },
  intelligence: {
    alerts: ["alerts"] as const,
    predictions: ["predictions"] as const,
    aiInsights: ["aiInsights"] as const,
  },
  misc: {
    notifications: ["notifications"] as const,
    reports: ["reports"] as const,
    arrests: ["arrests"] as const,
    chargesheets: ["chargesheets"] as const,
    auditLogs: ["auditLogs"] as const,
    healthServices: ["healthServices"] as const,
    graph: ["graph"] as const,
    currentUser: ["currentUser"] as const,
  },
};

export function useDashboardSummary() {
  return useQuery({ queryKey: kcipKeys.dashboard.summary, queryFn: kcipApi.dashboardSummary, staleTime: 60_000 });
}

export function useDashboardHotspots() {
  return useQuery({ queryKey: kcipKeys.dashboard.hotspots, queryFn: kcipApi.dashboardHotspots, staleTime: 60_000 });
}

export function useDashboardRecentCases(limit = 8) {
  return useQuery({ queryKey: [...kcipKeys.dashboard.recentCases, limit], queryFn: () => kcipApi.dashboardRecentCases(limit), staleTime: 60_000 });
}

export function useDashboardBootstrap() {
  return useQuery({ queryKey: kcipKeys.dashboard.bootstrap, queryFn: kcipApi.dashboardBootstrap, staleTime: 60_000 });
}

export function useDashboardHealth() {
  return useQuery({ queryKey: kcipKeys.dashboard.health, queryFn: kcipApi.dashboardHealth, staleTime: 60_000 });
}

export function useCases() {
  return useQuery({ queryKey: kcipKeys.cases, queryFn: kcipApi.cases, staleTime: 30_000 });
}

export function useVictims() {
  return useQuery({ queryKey: kcipKeys.victims, queryFn: kcipApi.victims, staleTime: 30_000 });
}

export function useAccused() {
  return useQuery({ queryKey: kcipKeys.accused, queryFn: kcipApi.accused, staleTime: 30_000 });
}

export function useEmployees() {
  return useQuery({ queryKey: kcipKeys.employees, queryFn: kcipApi.employees, staleTime: 30_000 });
}

export function useCrimeHeads() {
  return useQuery({ queryKey: kcipKeys.masters.crimeHeads, queryFn: kcipApi.crimeHeads, staleTime: 300_000 });
}

export function useCrimeSubheads() {
  return useQuery({ queryKey: kcipKeys.masters.crimeSubheads, queryFn: kcipApi.crimeSubheads, staleTime: 300_000 });
}

export function usePoliceStations() {
  return useQuery({ queryKey: kcipKeys.masters.policeStations, queryFn: kcipApi.policeStations, staleTime: 300_000 });
}

export function useDistricts() {
  return useQuery({ queryKey: kcipKeys.masters.districts, queryFn: kcipApi.districts, staleTime: 300_000 });
}

export function useCourts() {
  return useQuery({ queryKey: kcipKeys.masters.courts, queryFn: kcipApi.courts, staleTime: 300_000 });
}

export function useAlerts() {
  return useQuery({ queryKey: kcipKeys.intelligence.alerts, queryFn: kcipApi.alerts, staleTime: 30_000 });
}

export function usePredictions() {
  return useQuery({ queryKey: kcipKeys.intelligence.predictions, queryFn: kcipApi.predictions, staleTime: 60_000 });
}

export function useAiInsights() {
  return useQuery({ queryKey: kcipKeys.intelligence.aiInsights, queryFn: kcipApi.aiInsights, staleTime: 60_000 });
}

export function useNotifications() {
  return useQuery({ queryKey: kcipKeys.misc.notifications, queryFn: kcipApi.notifications, staleTime: 30_000 });
}

export function useReports() {
  return useQuery({ queryKey: kcipKeys.misc.reports, queryFn: kcipApi.reports, staleTime: 30_000 });
}

export function useArrests() {
  return useQuery({ queryKey: kcipKeys.misc.arrests, queryFn: kcipApi.arrests, staleTime: 30_000 });
}

export function useChargeSheets() {
  return useQuery({ queryKey: kcipKeys.misc.chargesheets, queryFn: kcipApi.chargesheets, staleTime: 30_000 });
}

export function useAuditLogs() {
  return useQuery({ queryKey: kcipKeys.misc.auditLogs, queryFn: kcipApi.auditLogs, staleTime: 30_000 });
}

export function useHealthServices() {
  return useQuery({ queryKey: kcipKeys.misc.healthServices, queryFn: kcipApi.healthServices, staleTime: 30_000 });
}

export function useGraph() {
  return useQuery({ queryKey: kcipKeys.misc.graph, queryFn: kcipApi.graph, staleTime: 60_000 });
}

export function useCurrentUser() {
  return useQuery({ queryKey: kcipKeys.misc.currentUser, queryFn: kcipApi.currentUser, staleTime: 300_000 });
}

export function useCreateCase() {
  return useMutation({ mutationFn: (payload: Parameters<typeof kcipApi.createCase>[0]) => kcipApi.createCase(payload) });
}

export function useCreateVictim() {
  return useMutation({ mutationFn: (payload: Parameters<typeof kcipApi.createVictim>[0]) => kcipApi.createVictim(payload) });
}

export function useCreateAccused() {
  return useMutation({ mutationFn: (payload: Parameters<typeof kcipApi.createAccused>[0]) => kcipApi.createAccused(payload) });
}
