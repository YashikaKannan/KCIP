import { fetchJson, type ApiResponse } from "./api";
import type { AlertRecord, PredictionRecord } from "./kcip";

export const getAlerts = () => fetchJson<ApiResponse<AlertRecord[]>>("/alerts");
export const getPredictions = () => fetchJson<ApiResponse<PredictionRecord>>("/predictions");
export const getAiInsights = () => fetchJson<ApiResponse<Array<{ title: string; desc: string; confidence: number; type: string }>>>("/ai-insights");
export const getGraph = () => fetchJson<ApiResponse<{ nodes: Array<any>; edges: Array<any> }>>("/graph");
