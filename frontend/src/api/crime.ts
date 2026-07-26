import { fetchJson, type ApiResponse } from "./api";

export const getCrimeHeads = () => fetchJson<ApiResponse<Array<{ id: string; name: string }>>>("/crime-heads");
export const getCrimeSubheads = () => fetchJson<ApiResponse<Array<{ id: string; headId: string; name: string }>>>("/crime-subheads");
