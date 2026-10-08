"use client";

import { useState } from "react";
import {
  Truck,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleStatusBadge } from "./vehicle-status-badge";
import { VehicleFormModal } from "./vehicle-form-modal";
import { useVehicles } from "@/hooks/use-vehicles";
import type {
  IVehicle,
  TVehicleStatus,
  TVehicleType,
} from "@/types/vehicle.types";

const VEHICLE_STATUSES: { label: string; value?: TVehicleStatus }[] = [
  { label: "All Statuses" },
  { label: "Available", value: "AVAILABLE" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Out of Service", value: "OUT_OF_SERVICE" },
];

export function VehiclesPage() {
  const {
    vehicles,
    meta,
    isLoading,
    error,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicles({ initialLimit: 10 });

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<IVehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingVehicle(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (v: IVehicle) => {
    setEditingVehicle(v);
    setFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this vehicle from the fleet?"))
      return;
    setDeletingId(id);
    try {
      await deleteVehicle(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (data: {
    vehicleNumber: string;
    type: TVehicleType;
    driverName?: string;
    capacity?: number;
    status?: TVehicleStatus;
    currentDriverId?: string;
  }) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, data);
    } else {
      await createVehicle(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Fleet & Vehicles Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage dispatch vehicles, track current driver assignments, and monitor fleet capacity.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
          <PlusCircle className="size-4" />
          <span>Add New Vehicle</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by Vehicle Plate Number or Driver Name..."
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
                (e.target.value as TVehicleStatus) || undefined,
              );
              setPage(1);
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
          >
            {VEHICLE_STATUSES.map((s) => (
              <option key={s.label} value={s.value || ""}>
                {s.label}
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

      {/* Vehicles Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Vehicle Number</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Assigned Driver</th>
                <th className="px-5 py-3.5">Capacity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span>Loading fleet records...</span>
                    </div>
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Truck className="size-10 stroke-1 text-muted-foreground/60" />
                      <p className="font-medium text-foreground">No vehicles registered</p>
                      <p className="text-xs">Click "Add New Vehicle" to register a transport vehicle.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="transition hover:bg-muted/30 group"
                  >
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-foreground">
                        {v.vehicleNumber}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {v.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground text-xs">
                        {v.driverName || v.currentDriver?.name || "Unassigned"}
                      </div>
                      {v.currentDriver?.email && (
                        <div className="text-[11px] text-muted-foreground">
                          {v.currentDriver.email}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-foreground">
                      {v.capacity ? `${v.capacity} kg` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <VehicleStatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(v)}
                          title="Edit Vehicle"
                        >
                          <Edit2 className="size-4 text-blue-500" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          disabled={deletingId === v.id || v.status === "IN_TRANSIT"}
                          onClick={() => handleDelete(v.id)}
                          title={
                            v.status === "IN_TRANSIT"
                              ? "Cannot delete vehicle in transit"
                              : "Delete Vehicle"
                          }
                        >
                          {deletingId === v.id ? (
                            <Loader2 className="size-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="size-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* Form Modal */}
      <VehicleFormModal
        vehicle={editingVehicle}
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
