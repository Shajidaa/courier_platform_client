"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shipmentApi } from "@/api/shipment.api";
import { apiClient } from "@/lib/api-client";
import type { IShipment } from "@/types/shipment.types";
import { AlertCircle, Loader2, Truck, User } from "lucide-react";

interface AssignRiderModalProps {
  shipment: IShipment | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RiderItem {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function AssignRiderModal({
  shipment,
  open,
  onClose,
  onSuccess,
}: AssignRiderModalProps) {
  const [riderId, setRiderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && shipment) {
      setRiderId(shipment.assignedCourier?.id || "");
      setError(null);
    }
  }, [open, shipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment || !riderId.trim()) {
      setError("Please enter or select a Rider ID.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await shipmentApi.assignRider(shipment.id, {
        riderId: riderId.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to assign rider.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Assign Rider Courier"
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

        {shipment && (
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1 text-xs">
            <p className="font-semibold text-foreground">
              Tracking: <span className="font-mono text-primary">{shipment.trackingNumber}</span>
            </p>
            <p className="text-muted-foreground">
              Recipient: {shipment.recipientName} ({shipment.recipientPhone})
            </p>
            <p className="text-muted-foreground">
              Delivery to: {shipment.recipientAddress}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Rider Profile ID <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={riderId}
              onChange={(e) => setRiderId(e.target.value)}
              placeholder="Enter Rider ID (e.g. rider uuid)"
              required
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Enter the registered Rider ID to assign this delivery parcel.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !riderId.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Rider"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
