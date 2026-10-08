import { apiClient } from "@/lib/api-client";
import type {
  IAssignRiderPayload,
  ICreateShipmentPayload,
  IShipment,
  IShipmentListQuery,
  IAdminShipmentListQuery,
  IShipmentResponse,
  IShipmentListApiResponse,
  IUpdateShipmentPayload,
  IUpdateShipmentStatusPayload,
} from "@/types/shipment.types";

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const shipmentApi = {
  /** POST /shipments — Create shipment (Sender only) */
  create: (payload: ICreateShipmentPayload) =>
    apiClient<IShipmentResponse>("/shipments", {
      method: "POST",
      body: payload,
    }),

  /** GET /shipments/my — Get authenticated sender shipments */
  getMyShipments: (query: IShipmentListQuery = {}) =>
    apiClient<IShipmentListApiResponse>(
      `/shipments/my${buildQuery(query as Record<string, string | number | undefined>)}`,
    ),

  /** GET /shipments — Get all shipments (Admin, Super Admin, Ops Manager, Hub Manager) */
  getAllShipments: (query: IAdminShipmentListQuery = {}) =>
    apiClient<IShipmentListApiResponse>(
      `/shipments${buildQuery(query as Record<string, string | number | undefined>)}`,
    ),

  /** GET /shipments/:id — Get shipment by ID with logs & payments */
  getById: (id: string) =>
    apiClient<IShipmentResponse>(`/shipments/${id}`),

  /** PATCH /shipments/:id — Update shipment (Sender only when PENDING/ACCEPTED) */
  update: (id: string, payload: IUpdateShipmentPayload) =>
    apiClient<IShipmentResponse>(`/shipments/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  /** DELETE /shipments/:id — Cancel shipment (Sender only when PENDING) */
  cancel: (id: string) =>
    apiClient<{ success: boolean; message: string }>(`/shipments/${id}`, {
      method: "DELETE",
    }),

  /** PATCH /shipments/:id/status — Update shipment status (Ops/Admin/Hub Manager) */
  updateStatus: (id: string, payload: IUpdateShipmentStatusPayload) =>
    apiClient<IShipmentResponse>(`/shipments/${id}/status`, {
      method: "PATCH",
      body: payload,
    }),

  /** PATCH /shipments/:id/assign-rider — Assign rider courier (Ops/Admin) */
  assignRider: (id: string, payload: IAssignRiderPayload) =>
    apiClient<IShipmentResponse>(`/shipments/${id}/assign-rider`, {
      method: "PATCH",
      body: payload,
    }),
};
