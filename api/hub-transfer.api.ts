import { apiClient } from "@/lib/api-client";
import type {
  IHubTransferResponse,
  IHubTransferListApiResponse,
  IInitiateTransferPayload,
  IReceiveTransferPayload,
  ITransferListQuery,
} from "@/types/hub-transfer.types";

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const hubTransferApi = {
  /** POST /hub-transfers — Initiate inter-hub transfer */
  initiate: (payload: IInitiateTransferPayload) =>
    apiClient<IHubTransferResponse>("/hub-transfers", {
      method: "POST",
      body: payload,
    }),

  /** GET /hub-transfers — List all transfers */
  getAll: (query: ITransferListQuery = {}) =>
    apiClient<IHubTransferListApiResponse>(
      `/hub-transfers${buildQuery(query as Record<string, string | number | undefined>)}`,
    ),

  /** GET /hub-transfers/:id — Get transfer by ID */
  getById: (id: string) =>
    apiClient<IHubTransferResponse>(`/hub-transfers/${id}`),

  /** PATCH /hub-transfers/:id/receive — Receive transfer at destination hub */
  receive: (id: string, payload: IReceiveTransferPayload = {}) =>
    apiClient<IHubTransferResponse>(`/hub-transfers/${id}/receive`, {
      method: "PATCH",
      body: payload,
    }),
};
