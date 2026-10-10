"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { ShipmentDetailModal } from "@/components/shipments/shipment-detail-modal";
import { StatusUpdateModal } from "@/components/shipments/status-update-modal";
import { shipmentApi } from "@/api/shipment.api";
import { useAuth } from "@/hooks/use-auth";
import type { IShipment } from "@/types/shipment.types";

export default function RiderDashboardPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalShipment, setStatusModalShipment] = useState<IShipment | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const fetchDeliveries = () => {
    setLoading(true);
    shipmentApi
      .getAllShipments({ limit: 10 })
      .then((res) => {
        setShipments(res.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const activeDeliveries = shipments.filter(
    (s) =>
      s.status === "PICKED_UP" ||
      s.status === "OUT_FOR_DELIVERY" ||
      s.status === "IN_HUB",
  );

  const deliveredCount = shipments.filter((s) => s.status === "DELIVERED").length;

  return (
    <RoleGuard allowedRoles={["RIDER"]}>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Rider Delivery Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            View assigned parcels, navigate delivery routes, and update customer handovers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Assigned Active Runs"
            value={loading ? "..." : String(activeDeliveries.length)}
            icon={Truck}
            iconClass="text-primary"
          />
          <StatCard
            label="Completed Deliveries"
            value={loading ? "..." : String(deliveredCount)}
            icon={CheckCircle2}
            iconClass="text-emerald-500"
          />
          <StatCard
            label="Rider Status"
            value="Active & Online"
            icon={Clock}
            iconClass="text-amber-500"
          />
        </div>

        {/* Active Deliveries List */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground text-lg">
                Current Deliveries
              </h3>
              <p className="text-xs text-muted-foreground">
                Parcels assigned for pickup or doorstep handover.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDeliveries}
              className="text-xs"
            >
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-sm">Loading delivery assignments...</span>
            </div>
          ) : shipments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No delivery runs assigned right now. Check back with dispatch.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {shipments.map((s) => (
                <div
                  key={s.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary text-base">
                        {s.trackingNumber}
                      </span>
                      <ShipmentStatusBadge status={s.status} />
                      <PaymentStatusBadge
                        status={
                          s.payments && s.payments.length > 0 && s.payments.every((p) => p.paymentStatus === "PAID")
                            ? "PAID"
                            : s.payments?.[0]?.paymentStatus ?? "PENDING"
                        }
                      />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {s.recipientName} ({s.recipientPhone})
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>{s.recipientAddress}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShipmentId(s.id);
                        setDetailModalOpen(true);
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setStatusModalShipment(s);
                        setStatusModalOpen(true);
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <ShipmentDetailModal
          shipmentId={selectedShipmentId}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedShipmentId(null);
          }}
        />

        <StatusUpdateModal
          shipment={statusModalShipment}
          open={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
            setStatusModalShipment(null);
          }}
          onSuccess={fetchDeliveries}
        />
      </div>
    </RoleGuard>
  );
}
