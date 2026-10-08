import { apiClient } from "@/lib/api-client";
import type {
  ICreateVehiclePayload,
  IUpdateVehiclePayload,
  IVehicleListQuery,
  IVehicleResponse,
  IVehicleListApiResponse,
} from "@/types/vehicle.types";

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const vehicleApi = {
  /** GET /vehicles — List all vehicles */
  getAll: (query: IVehicleListQuery = {}) =>
    apiClient<IVehicleListApiResponse>(
      `/vehicles${buildQuery(query as Record<string, string | number | undefined>)}`,
    ),

  /** GET /vehicles/:id — Get vehicle by ID */
  getById: (id: string) =>
    apiClient<IVehicleResponse>(`/vehicles/${id}`),

  /** POST /vehicles — Add new vehicle */
  create: (payload: ICreateVehiclePayload) =>
    apiClient<IVehicleResponse>("/vehicles", {
      method: "POST",
      body: payload,
    }),

  /** PATCH /vehicles/:id — Update vehicle */
  update: (id: string, payload: IUpdateVehiclePayload) =>
    apiClient<IVehicleResponse>(`/vehicles/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  /** DELETE /vehicles/:id — Delete vehicle */
  delete: (id: string) =>
    apiClient<{ success: boolean; message: string }>(`/vehicles/${id}`, {
      method: "DELETE",
    }),
};
