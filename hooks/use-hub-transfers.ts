"use client";

import { useState, useCallback, useEffect } from "react";
import { hubTransferApi } from "@/api/hub-transfer.api";
import type {
  IHubTransfer,
  ITransferPaginationMeta,
  TTransferStatus,
  IInitiateTransferPayload,
  IReceiveTransferPayload,
} from "@/types/hub-transfer.types";

interface UseHubTransfersOptions {
  initialStatus?: TTransferStatus;
  initialSourceHubId?: string;
  initialDestinationHubId?: string;
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useHubTransfers(options: UseHubTransfersOptions = {}) {
  const {
    initialStatus,
    initialSourceHubId,
    initialDestinationHubId,
    initialPage = 1,
    initialLimit = 10,
    autoFetch = true,
  } = options;

  const [transfers, setTransfers] = useState<IHubTransfer[]>([]);
  const [meta, setMeta] = useState<ITransferPaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState<TTransferStatus | undefined>(
    initialStatus,
  );
  const [sourceHubId, setSourceHubId] = useState<string | undefined>(
    initialSourceHubId,
  );
  const [destinationHubId, setDestinationHubId] = useState<string | undefined>(
    initialDestinationHubId,
  );
  const [page, setPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await hubTransferApi.getAll({
        page,
        limit: meta.limit,
        status: statusFilter,
        sourceHubId,
        destinationHubId,
      });
      setTransfers(res.data ?? []);
      if (res.meta) setMeta(res.meta);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch transfers";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, meta.limit, statusFilter, sourceHubId, destinationHubId]);

  useEffect(() => {
    if (autoFetch) {
      fetchTransfers();
    }
  }, [fetchTransfers, autoFetch]);

  const initiateTransfer = async (payload: IInitiateTransferPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await hubTransferApi.initiate(payload);
      await fetchTransfers();
      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to initiate transfer";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const receiveTransfer = async (
    id: string,
    payload: IReceiveTransferPayload = {},
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await hubTransferApi.receive(id, payload);
      await fetchTransfers();
      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to receive transfer";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transfers,
    meta,
    isLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    sourceHubId,
    setSourceHubId,
    destinationHubId,
    setDestinationHubId,
    refetch: fetchTransfers,
    initiateTransfer,
    receiveTransfer,
  };
}
