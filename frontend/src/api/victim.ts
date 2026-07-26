import { fetchJson, type ApiResponse } from "./api";
import type { VictimRecord } from "./kcip";

export const getVictims = () => fetchJson<ApiResponse<VictimRecord[]>>("/victims");
export const createVictim = (payload: Partial<VictimRecord>) => fetchJson<ApiResponse<VictimRecord>>("/victims", {
  method: "POST",
  body: JSON.stringify(payload),
});
