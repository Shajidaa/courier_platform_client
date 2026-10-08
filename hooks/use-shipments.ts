"use client"

import { useState, useCallback, useEffect } from "react"
import { shipmentApi } from "@/api/shipment.api"
import type {
  IShipment,
  IShipmentPaginationMeta,
  TShipmentStatus,
  ICreateShipmentPayload,
  IUpdateShipmentPayload,
  IUpdateShipmentStatusPayload,
  IAssignRiderPayload,
} from "@/types/shipment.types"

interface UseShipmentsOptions {
  isSender?: boolean
  initialStatus?: TShipmentStatus
  initialPage?: number
  initialLimit?: number
  initialSearch?: string
  autoFetch?: boolean
}

export function useShipments(options: UseShipmentsOptions = {}) {
  const {
    isSender = true,
    initialStatus,
    initialPage = 1,
    initialLimit = 10,
    initialSearch = "",
    autoFetch = true,
  } = options

  const [shipments, setShipments] = useState<IShipment[]>([])
  const [meta, setMeta] = useState<IShipmentPaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  })
  const [statusFilter, setStatusFilter] = useState<TShipmentStatus | undefined>(
    initialStatus
  )
  const [search, setSearch] = useState<string>(initialSearch)
  const [page, setPage] = useState<number>(initialPage)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchShipments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (isSender) {
        const res = await shipmentApi.getMyShipments({
          page,
          limit: meta.limit,
          status: statusFilter,
        })
        setShipments(res.data ?? [])
        if (res.meta) setMeta(res.meta)
      } else {
        const res = await shipmentApi.getAllShipments({
          page,
          limit: meta.limit,
          status: statusFilter,
          search: search || undefined,
        })
        setShipments(res.data ?? [])
        if (res.meta) setMeta(res.meta)
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch shipments"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [isSender, page, meta.limit, statusFilter, search])

  useEffect(() => {
    if (autoFetch) {
      fetchShipments()
    }
  }, [
    fetchShipments,
    autoFetch,
    page,
    meta.limit,
    statusFilter,
    search,
    isSender,
  ])

  const createShipment = async (payload: ICreateShipmentPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await shipmentApi.create(payload)
      await fetchShipments()
      return res.data
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create shipment"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateShipment = async (
    id: string,
    payload: IUpdateShipmentPayload
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await shipmentApi.update(id, payload)
      await fetchShipments()
      return res.data
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update shipment"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const cancelShipment = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await shipmentApi.cancel(id)
      await fetchShipments()
      return res
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel shipment"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (
    id: string,
    payload: IUpdateShipmentStatusPayload
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await shipmentApi.updateStatus(id, payload)
      await fetchShipments()
      return res.data
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update status"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const assignRider = async (id: string, payload: IAssignRiderPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await shipmentApi.assignRider(id, payload)
      await fetchShipments()
      return res.data
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to assign rider"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    shipments,
    meta,
    isLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    refetch: fetchShipments,
    createShipment,
    updateShipment,
    cancelShipment,
    updateStatus,
    assignRider,
  }
}
