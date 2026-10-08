"use client";

import { useState } from "react";
import {
  Send,
  PlusCircle,
  Building2,
  Truck,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransferStatusBadge } from "./transfer-status-badge";
import { InitiateTransferModal } from "./initiate-transfer-modal";
import { useHubTransfers } from "@/hooks/use-hub-transfers";
import type { IHubTransfer, TTransferStatus } from "@/types/hub-transfer.types";

const STATUS_FILTERS: { label: string; value?: TTransferStatus }[] = [
  { label: "All Transfers" },
  { label: "Dispatched", value: "DISPATCHED" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Received", value: "RECEIVED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function TransfersPage() {
  const {
    transfers,
    meta,
    isLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    receiveTransfer,
    refetch,
  } = useHubTransfers({ initialLimit: 10 });

  const [initiateModalOpen, setInitiateModalOpen] = useState(false);
  const [receivingId, setReceivingId] = useState<string | null>(null);

  const handleReceive = async (transfer: IHubTransfer) => {
    const confirmed = window.confirm(
      `Confirm receipt of transfer at "${transfer.destinationHub?.hubName}"? All contained shipments will be checked in.`,
    );
    if (!confirmed) return;

    setReceivingId(transfer.id);
    try {
      await receiveTransfer(transfer.id, {
        remarks: "Received and checked-in at destination hub.",
      });
    } finally {
      setReceivingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Hub-to-Hub Transfers
          </h2>
          <p className="text-sm text-muted-foreground">
            Coordinate inter-hub routing, batch parcel dispatch, and hub arrival check-ins.
          </p>
        </div>
        <Button
          onClick={() => setInitiateModalOpen(true)}
          className="gap-2 shadow-sm"
        >
          <PlusCircle className="size-4" />
          <span>Initiate Hub Transfer</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.label}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Transfers Data Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Transfer Route</th>
                <th className="px-5 py-3.5">Transport Vehicle</th>
                <th className="px-5 py-3.5">Dispatched Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Received By</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span>Loading hub transfer records...</span>
                    </div>
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Send className="size-10 stroke-1 text-muted-foreground/60" />
                      <p className="font-medium text-foreground">No hub transfers found</p>
                      <p className="text-xs">Click "Initiate Hub Transfer" to create a dispatch.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transfers.map((t) => {
                  const canReceive =
                    t.status === "DISPATCHED" || t.status === "IN_TRANSIT";

                  return (
                    <tr
                      key={t.id}
                      className="transition hover:bg-muted/30 group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                          <span>{t.sourceHub?.hubName}</span>
                          <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                          <span>{t.destinationHub?.hubName}</span>
                        </div>
                        {t.remarks && (
                          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1 italic">
                            Note: {t.remarks}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {t.vehicle ? (
                          <div className="space-y-0.5">
                            <div className="font-mono font-semibold text-foreground">
                              {t.vehicle.vehicleNumber}
                            </div>
                            <div className="text-muted-foreground">
                              {t.vehicle.type} {t.vehicle.driverName ? `• ${t.vehicle.driverName}` : ""}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">
                            Standard Dispatch
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {new Date(t.dispatchedAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <TransferStatusBadge status={t.status} />
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {t.receivedBy ? (
                          <div>
                            <span className="font-medium text-foreground">
                              {t.receivedBy.name}
                            </span>
                            <div className="text-[11px] text-muted-foreground">
                              {t.receivedAt ? new Date(t.receivedAt).toLocaleString() : ""}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {canReceive ? (
                          <Button
                            size="sm"
                            variant="default"
                            disabled={receivingId === t.id}
                            onClick={() => handleReceive(t)}
                            className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            {receivingId === t.id ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                <span>Receiving...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="size-3.5" />
                                <span>Receive at Hub</span>
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Page {meta.page} of {meta.totalPages} ({meta.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Initiate Modal */}
      <InitiateTransferModal
        open={initiateModalOpen}
        onClose={() => setInitiateModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
