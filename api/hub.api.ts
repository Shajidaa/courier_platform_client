import { apiClient } from "@/lib/api-client"
import { tokenStorage } from "@/lib/token"
import type {
    IAssignManagerPayload,
    ICreateHubPayload,
    IHub,
    IHubListQuery,
    IHubListResponse,
    IUpdateHubPayload,
} from "@/types/hub.types"
import type { IApiResponse } from "@/types/auth.types"

function authHeaders(): Record<string, string> {
    const token = tokenStorage.get()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

function buildQuery(params: Record<string, string | number | undefined>): string {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== "") q.set(k, String(v))
    }
    const s = q.toString()
    return s ? `?${s}` : ""
}

export const hubApi = {
    /** GET /hubs — ADMIN, SUPER_ADMIN, OPS_MANAGER, HUB_MANAGER */
    getAll: (query: IHubListQuery = {}) =>
        apiClient<IApiResponse<IHub[]> & { meta: IHubListResponse["meta"] }>(
            `/hubs${buildQuery(query as Record<string, string | number | undefined>)}`,
            { headers: authHeaders() },
        ),

    /** GET /hubs/:id */
    getById: (id: string) =>
        apiClient<IApiResponse<IHub>>(`/hubs/${id}`, {
            headers: authHeaders(),
        }),

    /** POST /hubs — ADMIN, SUPER_ADMIN */
    create: (payload: ICreateHubPayload) =>
        apiClient<IApiResponse<IHub>>("/hubs", {
            method: "POST",
            body: payload,
            headers: authHeaders(),
        }),

    /** PATCH /hubs/:id — ADMIN, SUPER_ADMIN */
    update: (id: string, payload: IUpdateHubPayload) =>
        apiClient<IApiResponse<IHub>>(`/hubs/${id}`, {
            method: "PATCH",
            body: payload,
            headers: authHeaders(),
        }),

    /** PATCH /hubs/:id/assign-manager — ADMIN, SUPER_ADMIN */
    assignManager: (id: string, payload: IAssignManagerPayload) =>
        apiClient<IApiResponse<IHub>>(`/hubs/${id}/assign-manager`, {
            method: "PATCH",
            body: payload,
            headers: authHeaders(),
        }),

    /** DELETE /hubs/:id — ADMIN, SUPER_ADMIN */
    delete: (id: string) =>
        apiClient<IApiResponse<null>>(`/hubs/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        }),
}
