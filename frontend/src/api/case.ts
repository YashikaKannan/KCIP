import { fetchJson, type ApiResponse } from "./api";
import type { CaseRecord } from "./kcip";

export const getCases = () => fetchJson<ApiResponse<CaseRecord[]>>("/cases");
export const getCaseById = (id: string) => fetchJson<ApiResponse<CaseRecord>>(`/cases/${encodeURIComponent(id)}`);
export const createCase = (payload: Partial<CaseRecord>) => fetchJson<ApiResponse<CaseRecord>>("/cases", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const updateCase = (id: string, payload: Partial<CaseRecord>) => fetchJson<ApiResponse<CaseRecord>>(`/cases/${encodeURIComponent(id)}`, {
  method: "PUT",
  body: JSON.stringify(payload),
});
export const deleteCase = (id: string) => fetchJson<ApiResponse<{ deleted: boolean }>>(`/cases/${encodeURIComponent(id)}`, {
  method: "DELETE",
});
