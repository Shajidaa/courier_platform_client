"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShipmentStatusBadge } from "./shipment-status-badge";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { ShipmentDetailModal } from "./shipment-detail-modal";
import { EditShipmentModal } from "./edit-shipment-modal";
import { BkashPaymentModal } from "@/components/payments/bkash-payment-modal";
import { useShipments } from "@/hooks/use-shipments";
import type { IShipment, TShipmentStatus } from "@/types/shipment.types";

const STATUS_TABS: { label: string; value?: TShipmentStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function SenderShipmentsTable() {
  const {
    shipments,
    meta,
    isLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    cancelShipment,
    refetch,
  } = useShipments({ isSender: true, initialLimit: 10 });

  // Modal states
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<IShipment | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedPayShipmentId, setSelectedPayShipmentId] = useState<string | null>(null);
  const [bkashModalOpen, setBkashModalOpen] = useState(false);

  const handleOpenDetail = (id: string) => {
    setSelectedShipmentId(id);
    setDetailModalOpen(true);
  };

  const handleOpenEdit = (shipment: IShipment) => {
    setEditingShipment(shipment);
    setEditModalOpen(true);
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this shipment?")) return;
    setCancellingId(id);
    try {
      await cancelShipment(id);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            My Shipments
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your booked shipments, track statuses, and view receipts.
          </p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <Link href="/dashboard/sender/book">
            <PlusCircle className="size-4" />
            <span>Book New Shipment</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${active
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              {tab.label}
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

      {/* Table Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Tracking Number</th>
                <th className="px-5 py-3.5">Recipient</th>
                <th className="px-5 py-3.5">Speed / Category</th>
                <th className="px-5 py-3.5">Charge</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Booked Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span>Loading shipments...</span>
                    </div>
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Package className="size-10 stroke-1 text-muted-foreground/60" />
                      <p className="font-medium text-foreground">No shipments found</p>
                      <p className="text-xs">
                        {statusFilter
                          ? `No ${statusFilter.toLowerCase().replace(/_/g, " ")} shipments found.`
                          : "You haven't booked any shipments yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => {
                  const isEditable =
                    shipment.status === "PENDING" ||
                    shipment.status === "ACCEPTED";
                  const isCancellable = shipment.status === "PENDING";

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
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground">
                          {shipment.recipientName}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {shipment.recipientPhone}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground text-xs">
                          {shipment.deliveryType.replace(/_/g, " ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {shipment.category} • {Number(shipment.maxWeight)} kg
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-foreground">
                        ৳{Number(shipment.deliveryCharge).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <ShipmentStatusBadge status={shipment.status} />
                          <PaymentStatusBadge
                            status={
                              shipment.payments && shipment.payments.length > 0 && shipment.payments.every((p) => p.paymentStatus === "PAID")
                                ? "PAID"
                                : shipment.payments?.[0]?.paymentStatus ?? "PENDING"
                            }
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleOpenDetail(shipment.id)}
                            title="View Full Tracking & Timeline"
                          >
                            <Eye className="size-4" />
                          </Button>

                          {isEditable && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleOpenEdit(shipment)}
                              title="Edit Shipment Details"
                            >
                              <Edit2 className="size-4 text-blue-500" />
                            </Button>
                          )}

                          {isCancellable && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              disabled={cancellingId === shipment.id}
                              onClick={() => handleCancel(shipment.id)}
                              title="Cancel Shipment"
                            >
                              {cancellingId === shipment.id ? (
                                <Loader2 className="size-4 animate-spin text-destructive" />
                              ) : (
                                <Trash2 className="size-4 text-destructive" />
                              )}
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

      {/* Detail Modal */}
      <ShipmentDetailModal
        shipmentId={selectedShipmentId}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedShipmentId(null);
        }}
        onPayBkash={(id) => {
          setSelectedPayShipmentId(id);
          setBkashModalOpen(true);
        }}
      />

      {/* Edit Modal */}
      <EditShipmentModal
        shipment={editingShipment}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingShipment(null);
        }}
        onSuccess={() => refetch()}
      />

      {/* bKash Payment Modal */}
      <BkashPaymentModal
        shipmentId={selectedPayShipmentId}
        open={bkashModalOpen}
        onClose={() => {
          setBkashModalOpen(false);
          setSelectedPayShipmentId(null);
        }}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
