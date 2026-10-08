"use client"

import { useCallback, useEffect, useState } from "react"
import { hubApi } from "@/api/hub.api"
import type {
    IHub,
    IHubListQuery,
    ICreateHubPayload,
    IUpdateHubPayload,
    IAssignManagerPayload,
    IHubListResponse,
} from "@/types/hub.types"

interface HubsState {
    hubs: IHub[]
    meta: IHubListResponse["meta"] | null
    isLoading: boolean
    error: string | null
}

export function useHubs(initialQuery: IHubListQuery = {}) {
    const [query, setQuery] = useState<IHubListQuery>({ page: 1, limit: 10, ...initialQuery })
    const [state, setState] = useState<HubsState>({
        hubs: [],
        meta: null,
        isLoading: true,
        error: null,
    })

    const fetch = useCallback(async (q: IHubListQuery) => {
        setState(s => ({ ...s, isLoading: true, error: null }))
        try {
            const res = await hubApi.getAll(q)
            setState({ hubs: res.data ?? [], meta: res.meta ?? null, isLoading: false, error: null })
        } catch (err) {
            setState(s => ({
                ...s,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to load hubs",
            }))
        }
    }, [])

    useEffect(() => { fetch(query) }, [fetch, JSON.stringify(query)])

    const refetch = useCallback(() => fetch(query), [fetch, query])

    const search = useCallback((s: string) => setQuery(q => ({ ...q, search: s, page: 1 })), [])
    const goToPage = useCallback((p: number) => setQuery(q => ({ ...q, page: p })), [])

    const createHub = useCallback(async (payload: ICreateHubPayload) => {
        const res = await hubApi.create(payload)
        await refetch()
        return res.data!
    }, [refetch])

    const updateHub = useCallback(async (id: string, payload: IUpdateHubPayload) => {
        const res = await hubApi.update(id, payload)
        setState(s => ({ ...s, hubs: s.hubs.map(h => h.id === id ? res.data! : h) }))
        return res.data!
    }, [])

    const assignManager = useCallback(async (id: string, payload: IAssignManagerPayload) => {
        const res = await hubApi.assignManager(id, payload)
        setState(s => ({ ...s, hubs: s.hubs.map(h => h.id === id ? res.data! : h) }))
        return res.data!
    }, [])

    const deleteHub = useCallback(async (id: string) => {
        await hubApi.delete(id)
        setState(s => ({ ...s, hubs: s.hubs.filter(h => h.id !== id) }))
    }, [])

    return { ...state, query, search, goToPage, refetch, createHub, updateHub, assignManager, deleteHub }
}

// Single hub
export function useHub(id: string) {
    const [hub, setHub] = useState<IHub | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        setIsLoading(true)
        hubApi.getById(id)
            .then(res => { setHub(res.data ?? null); setIsLoading(false) })
            .catch(err => { setError(err instanceof Error ? err.message : "Failed to load hub"); setIsLoading(false) })
    }, [id])

    return { hub, isLoading, error }
}
