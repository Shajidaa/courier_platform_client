"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shipmentApi } from "@/api/shipment.api";
import { hubApi } from "@/api/hub.api";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import type { IShipment, TShipmentStatus } from "@/types/shipment.types";
import type { IHub } from "@/types/hub.types";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

const ALLOWED_TRANSITIONS: Partial<Record<TShipmentStatus, TShipmentStatus[]>> = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_HUB"],
  IN_HUB: ["IN_TRANSIT"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED", "RETURNED"],
  FAILED: ["RETURNED"],
};

interface StatusUpdateModalProps {
  shipment: IShipment | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StatusUpdateModal({
  shipment,
  open,
  onClose,
  onSuccess,
}: StatusUpdateModalProps) {
  const [targetStatus, setTargetStatus] = useState<TShipmentStatus | "">("");
  const [note, setNote] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [hubId, setHubId] = useState("");
  const [hubs, setHubs] = useState<IHub[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableStatuses = shipment
    ? ALLOWED_TRANSITIONS[shipment.status] ?? []
    : [];

  useEffect(() => {
    if (open && shipment) {
      const allowed = ALLOWED_TRANSITIONS[shipment.status] ?? [];
      setTargetStatus(allowed[0] || "");
      setNote("");
      setCancellationReason("");
      setHubId(shipment.currentHub?.id || "");
      setError(null);

      // Fetch hubs if needed
      hubApi
        .getAll({ limit: 100 })
        .then((res) => setHubs(res.data ?? []))
        .catch(() => {});
    }
  }, [open, shipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment || !targetStatus) return;

    if (targetStatus === "CANCELLED" && !cancellationReason.trim()) {
      setError("Cancellation reason is required when cancelling.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await shipmentApi.updateStatus(shipment.id, {
        status: targetStatus,
        note: note.trim() || undefined,
        cancellationReason: cancellationReason.trim() || undefined,
        hubId: hubId || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update shipment status.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Update Shipment Status"
      onClose={onClose}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {shipment && (
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tracking Number</span>
              <span className="font-mono font-bold text-foreground">
                {shipment.trackingNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Status</span>
              <ShipmentStatusBadge status={shipment.status} />
            </div>
          </div>
        )}

        {availableStatuses.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            This shipment is in a terminal state ({shipment?.status}) and cannot be transitioned further.
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Select New Status
              </label>
              <select
                value={targetStatus}
                onChange={(e) =>
                  setTargetStatus(e.target.value as TShipmentStatus)
                }
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                required
              >
                {availableStatuses.map((s) => (
                  <option key={s} value={s} className="bg-background">
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {(targetStatus === "IN_HUB" || targetStatus === "IN_TRANSIT") && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Current / Destination Hub
                </label>
                <select
                  value={hubId}
                  onChange={(e) => setHubId(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                >
                  <option value="">Select a hub (optional)</option>
                  {hubs.map((h) => (
                    <option key={h.id} value={h.id} className="bg-background">
                      {h.hubName} ({h.address})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetStatus === "CANCELLED" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Cancellation Reason <span className="text-destructive">*</span>
                </label>
                <Input
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g. Customer requested cancellation"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Status Log Note (Optional)
              </label>
              <textarea
                rows={2}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                placeholder="Add internal notes about this status change..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !targetStatus}>
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
