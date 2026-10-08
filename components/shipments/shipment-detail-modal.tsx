"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Truck,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { shipmentApi } from "@/api/shipment.api";
import type { IShipment } from "@/types/shipment.types";

interface ShipmentDetailModalProps {
  shipmentId: string | null;
  open: boolean;
  onClose: () => void;
  onPayBkash?: (shipmentId: string) => void;
}

export function ShipmentDetailModal({
  shipmentId,
  open,
  onClose,
  onPayBkash,
}: ShipmentDetailModalProps) {
  const [shipment, setShipment] = useState<IShipment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !shipmentId) {
      setShipment(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    shipmentApi
      .getById(shipmentId)
      .then((res) => {
        if (isMounted) setShipment(res.data ?? null);
      })
      .catch((err) => {
        if (isMounted) setError(err.message ?? "Failed to load shipment details");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [open, shipmentId]);

  return (
    <Modal
      open={open}
      title={shipment ? `Tracking: ${shipment.trackingNumber}` : "Shipment Details"}
      onClose={onClose}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Loading shipment details...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="size-8 text-destructive mb-2" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      ) : shipment ? (
        <div className="space-y-6 text-sm">
          {/* Top banner card */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Status
              </span>
              <div className="flex items-center gap-2">
                <ShipmentStatusBadge status={shipment.status} className="text-sm py-1 px-3" />
                <span className="text-xs text-muted-foreground">
                  ({shipment.deliveryType.replace(/_/g, " ")})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Delivery Charge</span>
              <p className="text-base font-bold text-foreground">
                ৳{Number(shipment.deliveryCharge).toFixed(2)}
              </p>
              {Number(shipment.codAmount) > 0 && (
                <span className="text-xs text-muted-foreground">
                  COD: ৳{Number(shipment.codAmount).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Recipient & Sender Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Recipient info */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <MapPin className="size-4 text-primary" />
                <span>Recipient</span>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p className="font-semibold text-foreground text-sm">{shipment.recipientName}</p>
                <p className="flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {shipment.recipientPhone}
                </p>
                <p className="line-clamp-2">{shipment.recipientAddress}</p>
              </div>
            </div>

            {/* Sender / Logistics info */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <User className="size-4 text-primary" />
                <span>Sender & Hub</span>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p className="font-semibold text-foreground text-sm">
                  {shipment.sender?.user?.name ?? "Direct Booking"}
                </p>
                <p className="flex items-center gap-1.5">
                  <Building2 className="size-3.5" />
                  {shipment.currentHub ? shipment.currentHub.hubName : "Awaiting Hub Check-in"}
                </p>
                {shipment.assignedCourier && (
                  <p className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                    <Truck className="size-3.5" />
                    Courier: {shipment.assignedCourier.user.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Package className="size-4 text-primary" /> Package Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-lg bg-muted/40 p-2.5">
                <span className="text-muted-foreground">Category</span>
                <p className="font-semibold text-foreground mt-0.5">{shipment.category}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5">
                <span className="text-muted-foreground">Weight</span>
                <p className="font-semibold text-foreground mt-0.5">{Number(shipment.maxWeight)} kg</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5">
                <span className="text-muted-foreground">Dimensions</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {shipment.packageDimensions || "Standard"}
                </p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {shipment.estimatedDeliveryDate
                    ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString()
                    : "TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* Payments Section */}
          {shipment.payments && shipment.payments.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Wallet className="size-4 text-primary" /> Payment Information
                </h4>
                {onPayBkash &&
                  shipment.payments.some((p) => p.paymentStatus === "PENDING") && (
                    <button
                      onClick={() => onPayBkash(shipment.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#D12053] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#b01642]"
                    >
                      <span>Pay with bKash</span>
                      <ExternalLink className="size-3" />
                    </button>
                  )}
              </div>
              <div className="divide-y divide-border">
                {shipment.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 text-xs first:pt-0 last:pb-0"
                  >
                    <div>
                      <span className="font-medium text-foreground">
                        {p.paymentMethod.replace(/_/g, " ")}
                      </span>
                      {p.transactionId && (
                        <span className="ml-2 font-mono text-muted-foreground">
                          (TRX: {p.transactionId})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        ৳{Number(p.amount).toFixed(2)}
                      </span>
                      <PaymentStatusBadge status={p.paymentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking History Logs Timeline */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" /> Live Status Timeline
            </h4>
            {shipment.shipmentLogs && shipment.shipmentLogs.length > 0 ? (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {shipment.shipmentLogs.map((log, idx) => (
                  <div key={log.id} className="relative group">
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full bg-background border-2 border-primary text-primary">
                      <div className="size-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3 shadow-xs transition hover:border-primary/40">
                      <div className="flex items-center justify-between gap-2">
                        <ShipmentStatusBadge status={log.status} />
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-foreground">{log.note}</p>
                      {log.updatedBy && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Updated by: {log.updatedBy.name} ({log.updatedBy.role})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No status history recorded yet.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
