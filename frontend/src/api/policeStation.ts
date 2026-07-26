import { fetchJson, type ApiResponse } from "./api";

export const getPoliceStations = () => fetchJson<ApiResponse<Array<{ id: string; name: string; district: string }>>>("/police-stations");
