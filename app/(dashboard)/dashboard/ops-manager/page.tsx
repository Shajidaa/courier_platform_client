"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  Building2,
  Clock,
  CheckCircle,
  Send,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { shipmentApi } from "@/api/shipment.api";
import { vehicleApi } from "@/api/vehicle.api";
import { hubTransferApi } from "@/api/hub-transfer.api";
import type { IShipment } from "@/types/shipment.types";

export default function OpsManagerDashboardPage() {
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [totalShipments, setTotalShipments] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      shipmentApi.getAllShipments({ limit: 5 }),
      vehicleApi.getAll({ limit: 1 }),
      hubTransferApi.getAll({ limit: 1 }),
    ])
      .then(([shipmentsRes, vehiclesRes, transfersRes]) => {
        setShipments(shipmentsRes.data ?? []);
        setTotalShipments(shipmentsRes.meta?.total ?? (shipmentsRes.data?.length || 0));
        setVehicleCount(vehiclesRes.meta?.total ?? (vehiclesRes.data?.length || 0));
        setTransferCount(transfersRes.meta?.total ?? (transfersRes.data?.length || 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["OPS_MANAGER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Operations Command Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Dispatch management, courier assignments, vehicle tracking, and inter-hub transfers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Parcels"
            value={loading ? "..." : String(totalShipments)}
            icon={Package}
            iconClass="text-primary"
          />
          <StatCard
            label="Fleet Vehicles"
            value={loading ? "..." : String(vehicleCount)}
            icon={Truck}
            iconClass="text-amber-500"
          />
          <StatCard
            label="Active Transfers"
            value={loading ? "..." : String(transferCount)}
            icon={Send}
            iconClass="text-emerald-500"
          />
        </div>

        {/* Ops Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/ops-manager/shipments"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Dispatch & Rider Allocation
            </h4>
            <p className="text-xs text-muted-foreground">
              Assign riders to accepted shipments and advance pipeline stages.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/transfers"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Send className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Hub Route Transfers
            </h4>
            <p className="text-xs text-muted-foreground">
              Initiate multi-hub batch logistics and assign transport vehicles.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/vehicles"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Truck className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Fleet Capacity & Status
            </h4>
            <p className="text-xs text-muted-foreground">
              Monitor vehicle availability, maintenance, and driver allocations.
            </p>
          </Link>
        </div>

        {/* Recent Shipments */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="font-heading font-semibold text-foreground text-lg">
              Parcels In Pipeline
            </h3>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link href="/dashboard/ops-manager/shipments">
                <span>View All</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-sm">Loading parcel data...</span>
            </div>
          ) : shipments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No parcels currently in pipeline.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3">Tracking No</th>
                    <th className="pb-3">Recipient</th>
                    <th className="pb-3">Hub / Courier</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition">
                      <td className="py-3 font-mono font-bold text-primary">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3 text-xs text-foreground">
                        {s.recipientName} ({s.recipientPhone})
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {s.currentHub?.hubName ?? "Awaiting Hub"}
                      </td>
                      <td className="py-3">
                        <ShipmentStatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
