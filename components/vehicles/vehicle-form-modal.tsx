"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleStatusBadge } from "./vehicle-status-badge";
import type {
  IVehicle,
  TVehicleStatus,
  TVehicleType,
} from "@/types/vehicle.types";
import { AlertCircle, Loader2 } from "lucide-react";

const VEHICLE_TYPES: { label: string; value: TVehicleType }[] = [
  { label: "Delivery Van", value: "VAN" },
  { label: "Motorbike", value: "BIKE" },
  { label: "Heavy Truck", value: "TRUCK" },
  { label: "Scooter", value: "SCOOTER" },
  { label: "Bicycle", value: "BICYCLE" },
  { label: "Other", value: "OTHER" },
];

const VEHICLE_STATUSES: { label: string; value: TVehicleStatus }[] = [
  { label: "Available", value: "AVAILABLE" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Under Maintenance", value: "MAINTENANCE" },
  { label: "Out of Service", value: "OUT_OF_SERVICE" },
];

interface VehicleFormModalProps {
  vehicle: IVehicle | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    vehicleNumber: string;
    type: TVehicleType;
    driverName?: string;
    capacity?: number;
    status?: TVehicleStatus;
    currentDriverId?: string;
  }) => Promise<void>;
}

export function VehicleFormModal({
  vehicle,
  open,
  onClose,
  onSubmit,
}: VehicleFormModalProps) {
  const isEditing = Boolean(vehicle);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [type, setType] = useState<TVehicleType>("VAN");
  const [driverName, setDriverName] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [status, setStatus] = useState<TVehicleStatus>("AVAILABLE");
  const [driverId, setDriverId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (vehicle) {
        setVehicleNumber(vehicle.vehicleNumber || "");
        setType(vehicle.type || "VAN");
        setDriverName(vehicle.driverName || "");
        setCapacity(vehicle.capacity ? Number(vehicle.capacity) : "");
        setStatus(vehicle.status || "AVAILABLE");
        setDriverId(vehicle.currentDriverId || "");
      } else {
        setVehicleNumber("");
        setType("VAN");
        setDriverName("");
        setCapacity("");
        setStatus("AVAILABLE");
        setDriverId("");
      }
      setError(null);
    }
  }, [open, vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      setError("Vehicle plate / registration number is required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        type,
        driverName: driverName.trim() || undefined,
        capacity: capacity ? Number(capacity) : undefined,
        ...(isEditing && { status }),
        currentDriverId: driverId.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save vehicle.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? `Edit Vehicle: ${vehicle?.vehicleNumber}` : "Add Fleet Vehicle"}
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

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Vehicle Number / Registration <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. DHA-MET-11-2045"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Vehicle Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TVehicleType)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-background">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Capacity (KG)
            </label>
            <Input
              type="number"
              min="1"
              placeholder="e.g. 500"
              value={capacity}
              onChange={(e) =>
                setCapacity(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Driver Name
          </label>
          <Input
            placeholder="e.g. Mohammad Ali"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Assigned Driver User ID (Optional)
          </label>
          <Input
            placeholder="User UUID for RIDER role"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          />
        </div>

        {isEditing && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Operational Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TVehicleStatus)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            >
              {VEHICLE_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-background">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add Vehicle"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
