"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Package,
  Send,
  Truck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { shipmentApi } from "@/api/shipment.api";
import { hubTransferApi } from "@/api/hub-transfer.api";
import { useAuth } from "@/hooks/use-auth";
import type { IShipment } from "@/types/shipment.types";

export default function HubManagerDashboardPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [totalInHub, setTotalInHub] = useState(0);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      shipmentApi.getAllShipments({ limit: 5 }),
      hubTransferApi.getAll({ limit: 1 }),
    ])
      .then(([shipmentsRes, transfersRes]) => {
        setShipments(shipmentsRes.data ?? []);
        setTotalInHub(shipmentsRes.meta?.total ?? (shipmentsRes.data?.length || 0));
        setTotalTransfers(transfersRes.meta?.total ?? (transfersRes.data?.length || 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["HUB_MANAGER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Hub Management Portal
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage incoming parcel check-ins, local sorting, out-for-delivery dispatches, and hub transfers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Parcels In Hub"
            value={loading ? "..." : String(totalInHub)}
            icon={Package}
            iconClass="text-primary"
          />
          <StatCard
            label="Incoming / Outgoing Transfers"
            value={loading ? "..." : String(totalTransfers)}
            icon={Send}
            iconClass="text-emerald-500"
          />
          <StatCard
            label="Active Riders"
            value={loading ? "..." : "Available"}
            icon={Truck}
            iconClass="text-amber-500"
          />
        </div>

        {/* Hub Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/hub-manager/shipments"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Hub Shipments & Sorting
            </h4>
            <p className="text-xs text-muted-foreground">
              Scan parcels, transition statuses to IN_HUB / OUT_FOR_DELIVERY, and assign local couriers.
            </p>
          </Link>

          <Link
            href="/dashboard/hub-manager/transfers"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md space-y-2"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Send className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition">
              Receive Incoming Transfers
            </h4>
            <p className="text-xs text-muted-foreground">
              Confirm arrival of transferred batches from other regional hubs in 1 click.
            </p>
          </Link>
        </div>

        {/* Recent Shipments */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="font-heading font-semibold text-foreground text-lg">
              Hub Activity Log
            </h3>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link href="/dashboard/hub-manager/shipments">
                <span>View All Hub Parcels</span>
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
              No shipments logged in this hub.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3">Tracking No</th>
                    <th className="pb-3">Recipient</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition">
                      <td className="py-3 font-mono font-bold text-primary">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3 text-xs text-foreground">
                        {s.recipientName}
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
