import { apiClient } from "@/lib/api-client";
import type {
  IAreaResponse,
  IAreaListApiResponse,
  IAreaListQuery,
  ICreateAreaPayload,
} from "@/types/area.types";

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const areaApi = {
  /** POST /areas — Create coverage area under a hub (Admin / Super Admin) */
  create: (payload: ICreateAreaPayload) =>
    apiClient<IAreaResponse>("/areas", {
      method: "POST",
      body: payload,
    }),

  /** GET /areas — List all service areas (Public / Staff) */
  getAll: (query: IAreaListQuery = {}) =>
    apiClient<IAreaListApiResponse>(
      `/areas${buildQuery(query as Record<string, string | number | undefined>)}`,
    ),
};
