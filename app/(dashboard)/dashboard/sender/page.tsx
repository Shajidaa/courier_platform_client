"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle,
  Wallet,
  PlusCircle,
  ArrowRight,
  Eye,
  Truck,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { ShipmentDetailModal } from "@/components/shipments/shipment-detail-modal";
import { useShipments } from "@/hooks/use-shipments";
import { useAuth } from "@/hooks/use-auth";

export default function SenderDashboard() {
  const { user } = useAuth();
  const { shipments, isLoading, error } = useShipments({
    isSender: true,
    initialLimit: 5,
  });

  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Compute live metrics
  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter(
    (s) =>
      s.status === "IN_TRANSIT" ||
      s.status === "IN_HUB" ||
      s.status === "OUT_FOR_DELIVERY" ||
      s.status === "PICKED_UP",
  ).length;
  const deliveredCount = shipments.filter((s) => s.status === "DELIVERED").length;
  const totalSpent = shipments
    .filter((s) => s.status !== "CANCELLED")
    .reduce((sum, s) => sum + Number(s.deliveryCharge || 0), 0);

  const handleOpenDetail = (id: string) => {
    setSelectedShipmentId(id);
    setDetailModalOpen(true);
  };

  return (
    <RoleGuard allowedRoles={["SENDER"]}>
      <div className="flex flex-col gap-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back, {user?.name ?? "Sender"}!
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Here is what's happening with your shipments and deliveries today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="gap-2 shadow-sm font-semibold">
              <Link href="/dashboard/sender/book">
                <PlusCircle className="size-4" />
                <span>Book Shipment</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Bookings"
            value={isLoading ? "..." : String(totalShipments)}
            icon={Package}
            iconClass="text-primary"
          />
          <StatCard
            label="Active In Transit"
            value={isLoading ? "..." : String(inTransitCount)}
            icon={Clock}
            iconClass="text-amber-500"
          />
          <StatCard
            label="Successfully Delivered"
            value={isLoading ? "..." : String(deliveredCount)}
            icon={CheckCircle}
            iconClass="text-emerald-500"
          />
          <StatCard
            label="Total Delivery Fees"
            value={isLoading ? "..." : `৳${totalSpent.toFixed(2)}`}
            icon={Wallet}
            iconClass="text-violet-500"
          />
        </div>

        {/* Quick Action Banner */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/sender/book"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <PlusCircle className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground text-base group-hover:text-primary transition">
              Create New Shipment
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Book a parcel with dynamic pricing & pickup scheduling.
            </p>
          </Link>

          <Link
            href="/dashboard/sender/shipments"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3">
              <Package className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground text-base group-hover:text-primary transition">
              Track All Shipments
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              View status pipeline history, courier info, and POD.
            </p>
          </Link>

          <Link
            href="/dashboard/sender/payments"
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
              <Wallet className="size-5" />
            </div>
            <h4 className="font-heading font-semibold text-foreground text-base group-hover:text-primary transition">
              Payments & Invoices
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Manage bKash online settlements and COD receipts.
            </p>
          </Link>
        </div>

        {/* Recent Shipments Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground text-lg">
                Recent Shipments
              </h3>
              <p className="text-xs text-muted-foreground">
                Your latest booked shipments and real-time status.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link href="/dashboard/sender/shipments">
                <span>View All</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-sm">Loading recent shipments...</span>
            </div>
          ) : shipments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              You haven't created any shipments yet. Click "Book Shipment" above to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-3">Tracking No</th>
                    <th className="pb-3">Recipient</th>
                    <th className="pb-3">Speed</th>
                    <th className="pb-3">Charge</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition">
                      <td className="py-3 font-mono font-bold text-primary">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-foreground">{s.recipientName}</div>
                        <div className="text-xs text-muted-foreground">{s.recipientPhone}</div>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {s.deliveryType.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 font-semibold text-foreground">
                        ৳{Number(s.deliveryCharge).toFixed(2)}
                      </td>
                      <td className="py-3">
                        <ShipmentStatusBadge status={s.status} />
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleOpenDetail(s.id)}
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <ShipmentDetailModal
          shipmentId={selectedShipmentId}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedShipmentId(null);
          }}
        />
      </div>
    </RoleGuard>
  );
}
