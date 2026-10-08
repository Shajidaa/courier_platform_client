import type { IApiResponse } from "./auth.types"

// ── Hub shapes (match server include) ─────────────────────────────────────────

export interface IHubManager {
    id: string
    name: string
    email: string
    role: string
}

export interface IHubArea {
    id: string
    name: string
    postalCode: string
}

export interface IHub {
    id: string
    hubName: string
    address: string
    managerId: string | null
    manager: IHubManager | null
    areas: IHubArea[]
    _count: { areas: number; currentShipments: number }
    createdAt: string
    updatedAt: string
}

// ── Request payloads (match server validation) ────────────────────────────────

export interface ICreateHubPayload {
    hubName: string
    address: string
    managerId?: string
}

export interface IUpdateHubPayload {
    hubName?: string
    address?: string
}

export interface IAssignManagerPayload {
    managerId: string
}

export interface IHubListQuery {
    page?: number
    limit?: number
    search?: string
}

// ── Paginated response ────────────────────────────────────────────────────────

export interface IHubListResponse {
    data: IHub[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export type IHubResponse = IApiResponse<IHub>
export type IHubListApiResponse = IApiResponse<IHub[]> & { meta?: IHubListResponse["meta"] }
