"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shipmentApi } from "@/api/shipment.api";
import { hubApi } from "@/api/hub.api";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import type { IShipment, TShipmentStatus } from "@/types/shipment.types";
import type { IHub } from "@/types/hub.types";
import { AlertCircle, ArrowRight, Loader2, ShieldAlert } from "lucide-react";

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
  const [currentShipment, setCurrentShipment] = useState<IShipment | null>(shipment);
  const [targetStatus, setTargetStatus] = useState<TShipmentStatus | "">("");
  const [note, setNote] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [hubId, setHubId] = useState("");
  const [hubs, setHubs] = useState<IHub[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeShipment = currentShipment ?? shipment;
  const availableStatuses = activeShipment
    ? ALLOWED_TRANSITIONS[activeShipment.status] ?? []
    : [];

  const isPaymentPaid = Boolean(
    activeShipment?.payments &&
      activeShipment.payments.length > 0 &&
      activeShipment.payments.every((p) => p.paymentStatus === "PAID"),
  );

  const primaryPayment = activeShipment?.payments?.[0];
  const currentPaymentStatus = primaryPayment?.paymentStatus ?? "PENDING";
  const payableAmount = Number(
    primaryPayment?.amount ??
      Number(activeShipment?.deliveryCharge || 0) +
        Number(activeShipment?.codAmount || 0),
  ).toFixed(2);

  useEffect(() => {
    if (open && shipment) {
      setCurrentShipment(shipment);
      const allowed = ALLOWED_TRANSITIONS[shipment.status] ?? [];
      setTargetStatus(allowed[0] || "");
      setNote("");
      setCancellationReason("");
      setHubId(shipment.currentHub?.id || "");
      setError(null);

      // Fetch fresh details with latest payments data
      shipmentApi
        .getById(shipment.id)
        .then((res) => {
          if (res.data) {
            setCurrentShipment(res.data);
          }
        })
        .catch(() => {});

      // Fetch hubs if needed
      hubApi
        .getAll({ limit: 100 })
        .then((res) => setHubs(res.data ?? []))
        .catch(() => {});
    }
  }, [open, shipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShipment || !targetStatus) return;

    if (targetStatus === "CANCELLED" && !cancellationReason.trim()) {
      setError("Cancellation reason is required when cancelling.");
      return;
    }

    if (targetStatus === "DELIVERED" && !isPaymentPaid) {
      setError(
        "Payment is pending. Shipment cannot be marked as Delivered without completed payment.",
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await shipmentApi.updateStatus(activeShipment.id, {
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

        {activeShipment && (
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tracking Number</span>
              <span className="font-mono font-bold text-foreground">
                {activeShipment.trackingNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Status</span>
              <ShipmentStatusBadge status={activeShipment.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Payment Status</span>
              <div className="flex items-center gap-2">
                <PaymentStatusBadge status={currentPaymentStatus} />
                <span className="text-xs font-semibold text-foreground">
                  ৳{payableAmount}
                </span>
              </div>
            </div>
          </div>
        )}

        {availableStatuses.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            This shipment is in a terminal state ({activeShipment?.status}) and cannot be transitioned further.
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
                  <option
                    key={s}
                    value={s}
                    disabled={s === "DELIVERED" && !isPaymentPaid}
                    className="bg-background"
                  >
                    {s === "DELIVERED" && !isPaymentPaid
                      ? "DELIVERED (Requires Completed Payment)"
                      : s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {targetStatus === "DELIVERED" && !isPaymentPaid && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">Payment Required Before Delivery</p>
                  <p>
                    This shipment cannot be marked as <span className="font-semibold">DELIVERED</span> because payment is still <span className="font-semibold uppercase">{currentPaymentStatus}</span>. Payment must be completed before delivering.
                  </p>
                </div>
              </div>
            )}

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
              <Button
                type="submit"
                disabled={
                  loading ||
                  !targetStatus ||
                  (targetStatus === "DELIVERED" && !isPaymentPaid)
                }
              >
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
