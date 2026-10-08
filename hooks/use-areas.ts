"use client";

import { useState, useCallback, useEffect } from "react";
import { areaApi } from "@/api/area.api";
import type {
  IArea,
  IAreaPaginationMeta,
  ICreateAreaPayload,
} from "@/types/area.types";

interface UseAreasOptions {
  initialHubId?: string;
  initialSearch?: string;
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useAreas(options: UseAreasOptions = {}) {
  const {
    initialHubId,
    initialSearch = "",
    initialPage = 1,
    initialLimit = 10,
    autoFetch = true,
  } = options;

  const [areas, setAreas] = useState<IArea[]>([]);
  const [meta, setMeta] = useState<IAreaPaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });
  const [hubId, setHubId] = useState<string | undefined>(initialHubId);
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await areaApi.getAll({
        page,
        limit: meta.limit,
        hubId,
        search: search || undefined,
      });
      setAreas(res.data ?? []);
      if (res.meta) setMeta(res.meta);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch service areas";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, meta.limit, hubId, search]);

  useEffect(() => {
    if (autoFetch) {
      fetchAreas();
    }
  }, [fetchAreas, autoFetch]);

  const createArea = async (payload: ICreateAreaPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await areaApi.create(payload);
      await fetchAreas();
      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create area";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    areas,
    meta,
    isLoading,
    error,
    page,
    setPage,
    hubId,
    setHubId,
    search,
    setSearch,
    refetch: fetchAreas,
    createArea,
  };
}
