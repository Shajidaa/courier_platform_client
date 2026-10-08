"use client";

import { useState } from "react";
import {
  Package,
  Search,
  Eye,
  RefreshCw,
  UserCheck,
  Building2,
  Truck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import { ShipmentDetailModal } from "./shipment-detail-modal";
import { StatusUpdateModal } from "./status-update-modal";
import { AssignRiderModal } from "./assign-rider-modal";
import { useShipments } from "@/hooks/use-shipments";
import { useAuth } from "@/hooks/use-auth";
import type { IShipment, TShipmentStatus } from "@/types/shipment.types";

const ALL_STATUSES: TShipmentStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PICKED_UP",
  "IN_HUB",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "RETURNED",
  "CANCELLED",
];

export function AdminShipmentsTable() {
  const { user } = useAuth();
  const {
    shipments,
    meta,
    isLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    refetch,
  } = useShipments({ isSender: false, initialLimit: 10 });

  // Modal states
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalShipment, setStatusModalShipment] = useState<IShipment | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [assignRiderShipment, setAssignRiderShipment] = useState<IShipment | null>(null);
  const [assignRiderModalOpen, setAssignRiderModalOpen] = useState(false);

  const handleOpenDetail = (id: string) => {
    setSelectedShipmentId(id);
    setDetailModalOpen(true);
  };

  const handleOpenStatusModal = (shipment: IShipment) => {
    setStatusModalShipment(shipment);
    setStatusModalOpen(true);
  };

  const handleOpenAssignRider = (shipment: IShipment) => {
    setAssignRiderShipment(shipment);
    setAssignRiderModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Shipments Operations
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitor all parcels across hubs, dispatch couriers, and advance workflow statuses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by Tracking No, Recipient, Sender, or Phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div>
          <select
            value={statusFilter || ""}
            onChange={(e) => {
              setStatusFilter(
                (e.target.value as TShipmentStatus) || undefined,
              );
              setPage(1);
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
          >
            <option value="">All Statuses (Filter)</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Shipments Data Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Tracking Number</th>
                <th className="px-5 py-3.5">Sender</th>
                <th className="px-5 py-3.5">Recipient</th>
                <th className="px-5 py-3.5">Hub / Courier</th>
                <th className="px-5 py-3.5">Charge</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span>Loading shipment records...</span>
                    </div>
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Package className="size-10 stroke-1 text-muted-foreground/60" />
                      <p className="font-medium text-foreground">No shipments match criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => {
                  const isTerminal = [
                    "DELIVERED",
                    "CANCELLED",
                    "RETURNED",
                  ].includes(shipment.status);
                  const isStaff =
                    user?.role === "ADMIN" ||
                    user?.role === "SUPER_ADMIN" ||
                    user?.role === "OPS_MANAGER" ||
                    user?.role === "HUB_MANAGER";
                  const canAssignRider =
                    isStaff &&
                    ["ACCEPTED", "PICKED_UP"].includes(shipment.status);

                  return (
                    <tr
                      key={shipment.id}
                      className="transition hover:bg-muted/30 group"
                    >
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleOpenDetail(shipment.id)}
                          className="font-mono font-bold text-primary hover:underline"
                        >
                          {shipment.trackingNumber}
                        </button>
                        <div className="text-[11px] text-muted-foreground">
                          {shipment.deliveryType.replace(/_/g, " ")} • {Number(shipment.maxWeight)}kg
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground text-xs">
                          {shipment.sender?.user?.name ?? "Direct Booking"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {shipment.sender?.user?.email}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground">
                          {shipment.recipientName}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {shipment.recipientAddress}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          <span>{shipment.currentHub?.hubName ?? "Unassigned"}</span>
                        </div>
                        {shipment.assignedCourier ? (
                          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 mt-0.5">
                            <Truck className="size-3" />
                            <span>{shipment.assignedCourier.user.name}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">
                            No rider assigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-foreground">
                        ৳{Number(shipment.deliveryCharge).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <ShipmentStatusBadge status={shipment.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleOpenDetail(shipment.id)}
                            title="View Full Detail"
                          >
                            <Eye className="size-4" />
                          </Button>

                          {!isTerminal && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenStatusModal(shipment)}
                              className="gap-1.5 text-xs h-7"
                              title="Advance Status"
                            >
                              <RefreshCw className="size-3" />
                              <span>Update</span>
                            </Button>
                          )}

                          {canAssignRider && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleOpenAssignRider(shipment)}
                              title="Assign Rider Courier"
                            >
                              <UserCheck className="size-4 text-primary" />
                            </Button>
                          )}
                        </div>
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

      {/* Modals */}
      <ShipmentDetailModal
        shipmentId={selectedShipmentId}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedShipmentId(null);
        }}
        onAssignRider={handleOpenAssignRider}
      />

      <StatusUpdateModal
        shipment={statusModalShipment}
        open={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setStatusModalShipment(null);
        }}
        onSuccess={() => refetch()}
      />

      <AssignRiderModal
        shipment={assignRiderShipment}
        open={assignRiderModalOpen}
        onClose={() => {
          setAssignRiderModalOpen(false);
          setAssignRiderShipment(null);
        }}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
