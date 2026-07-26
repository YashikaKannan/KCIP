import { fetchJson, type ApiResponse } from "./api";

export const getCourts = () => fetchJson<ApiResponse<string[]>>("/courts");
