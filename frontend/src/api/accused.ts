import { fetchJson, type ApiResponse } from "./api";
import type { AccusedRecord } from "./kcip";

export const getAccused = () => fetchJson<ApiResponse<AccusedRecord[]>>("/accused");
export const createAccused = (payload: Partial<AccusedRecord>) => fetchJson<ApiResponse<AccusedRecord>>("/accused", {
  method: "POST",
  body: JSON.stringify(payload),
});
