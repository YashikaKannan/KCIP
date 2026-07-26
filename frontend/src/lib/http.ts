export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

const rawBaseUrl = import.meta.env.VITE_API_URL;
const useRelativeOrigin = !rawBaseUrl && import.meta.env.DEV;
if (!rawBaseUrl && !useRelativeOrigin) {
  throw new Error("Missing VITE_API_URL environment variable. Set it in .env or your deployment environment.");
}
const API_BASE_URL = useRelativeOrigin ? "" : rawBaseUrl.replace(/\/$/, "");
const API_PREFIX = "/api";

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${normalizedPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.detail ?? payload?.message ?? `Request failed (${response.status})`;
    throw new Error(message);
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload as T;
  }

  return payload as T;
}
