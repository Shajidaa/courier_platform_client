"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  Building2,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
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
import { hubApi } from "@/api/hub.api";
import { vehicleApi } from "@/api/vehicle.api";
import { hubTransferApi } from "@/api/hub-transfer.api";
import type { IShipment } from "@/types/shipment.types";

export default function AdminDashboardPage() {
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [totalShipments, setTotalShipments] = useState(0);
  const [hubCount, setHubCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      shipmentApi.getAllShipments({ limit: 5 }),
      hubApi.getAll({ limit: 1 }),
      vehicleApi.getAll({ limit: 1 }),
      hubTransferApi.getAll({ limit: 1 }),
    ])
      .then(([shipmentsRes, hubsRes, vehiclesRes, transfersRes]) => {
        setShipments(shipmentsRes.data ?? []);
        setTotalShipments(shipmentsRes.meta?.total ?? (shipmentsRes.data?.length || 0));
        setHubCount(hubsRes.meta?.total ?? (hubsRes.data?.length || 0));
        setVehicleCount(vehiclesRes.meta?.total ?? (vehiclesRes.data?.length || 0));
        setTransferCount(transfersRes.meta?.total ?? (transfersRes.data?.length || 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary w-fit">
            <ShieldCheck className="size-3.5" />
            <span>Master Operations Dashboard</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            System Overview & Operations
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time telemetry across nationwide shipments, active hubs, transport fleet, and transfers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total System Shipments"
            value={loading ? "..." : String(totalShipments)}
            icon={Package}
            iconClass="text-primary"
          />
          <StatCard
            label="Operational Hubs"
            value={loading ? "..." : String(hubCount)}
            icon={Building2}
            iconClass="text-violet-500"
          />
          <StatCard
            label="Fleet Vehicles"
            value={loading ? "..." : String(vehicleCount)}
            icon={Truck}
            iconClass="text-amber-500"
          />
          <StatCard
            label="Hub Transfers"
            value={loading ? "..." : String(transferCount)}
            icon={Send}
            iconClass="text-emerald-500"
          />
        </div>

        {/* Operational Modules Navigation Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/admin/shipments"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Shipment Operations
            </h4>
            <p className="text-xs text-muted-foreground">
              Monitor parcel pipelines, update status transitions, and assign couriers.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/hubs"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Building2 className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Hubs Network
            </h4>
            <p className="text-xs text-muted-foreground">
              Manage distribution centers, assign hub managers, and review capacity.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/areas"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <MapPin className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Service Areas
            </h4>
            <p className="text-xs text-muted-foreground">
              Configure postal codes, delivery territories, and hub assignments.
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
              Hub Transfers
            </h4>
            <p className="text-xs text-muted-foreground">
              Coordinate batch inter-hub dispatches and confirm arrival check-ins.
            </p>
          </Link>
        </div>

        {/* Live Shipments Table Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground text-lg">
                Recent System Parcels
              </h3>
              <p className="text-xs text-muted-foreground">
                Latest parcel activities across all distribution hubs.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link href="/dashboard/admin/shipments">
                <span>View Operations Center</span>
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
              No parcels recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3">Tracking No</th>
                    <th className="pb-3">Sender</th>
                    <th className="pb-3">Recipient</th>
                    <th className="pb-3">Hub</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition">
                      <td className="py-3 font-mono font-bold text-primary">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3 text-xs text-foreground">
                        {s.sender?.user?.name ?? "Sender"}
                      </td>
                      <td className="py-3 text-xs text-foreground">
                        {s.recipientName}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {s.currentHub?.hubName ?? "Awaiting Hub"}
                      </td>
                      <td className="py-3">
                        <ShipmentStatusBadge status={s.status} />
                      </td>
                      <td className="py-3 text-right text-xs text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString()}
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
