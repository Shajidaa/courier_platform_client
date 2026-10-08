"use client";

import { useState, useCallback, useEffect } from "react";
import { vehicleApi } from "@/api/vehicle.api";
import type {
  IVehicle,
  IVehiclePaginationMeta,
  TVehicleStatus,
  TVehicleType,
  ICreateVehiclePayload,
  IUpdateVehiclePayload,
} from "@/types/vehicle.types";

interface UseVehiclesOptions {
  initialStatus?: TVehicleStatus;
  initialType?: TVehicleType;
  initialSearch?: string;
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useVehicles(options: UseVehiclesOptions = {}) {
  const {
    initialStatus,
    initialType,
    initialSearch = "",
    initialPage = 1,
    initialLimit = 10,
    autoFetch = true,
  } = options;

  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [meta, setMeta] = useState<IVehiclePaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState<TVehicleStatus | undefined>(
    initialStatus,
  );
  const [typeFilter, setTypeFilter] = useState<TVehicleType | undefined>(
    initialType,
  );
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await vehicleApi.getAll({
        page,
        limit: meta.limit,
        status: statusFilter,
        type: typeFilter,
        search: search || undefined,
      });
      setVehicles(res.data ?? []);
      if (res.meta) setMeta(res.meta);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch vehicles";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, meta.limit, statusFilter, typeFilter, search]);

  useEffect(() => {
    if (autoFetch) {
      fetchVehicles();
    }
  }, [fetchVehicles, autoFetch]);

  const createVehicle = async (payload: ICreateVehiclePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await vehicleApi.create(payload);
      await fetchVehicles();
      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add vehicle";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicle = async (id: string, payload: IUpdateVehiclePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await vehicleApi.update(id, payload);
      await fetchVehicles();
      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update vehicle";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await vehicleApi.delete(id);
      await fetchVehicles();
      return res;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete vehicle";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vehicles,
    meta,
    isLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    refetch: fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
