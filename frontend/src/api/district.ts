import { fetchJson, type ApiResponse } from "./api";

export const getDistricts = () => fetchJson<ApiResponse<string[]>>("/districts");
