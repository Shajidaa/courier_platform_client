"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hubApi } from "@/api/hub.api";
import { vehicleApi } from "@/api/vehicle.api";
import { shipmentApi } from "@/api/shipment.api";
import { hubTransferApi } from "@/api/hub-transfer.api";
import type { IHub } from "@/types/hub.types";
import type { IVehicle } from "@/types/vehicle.types";
import type { IShipment } from "@/types/shipment.types";
import { AlertCircle, ArrowRight, Building2, Loader2, Package, Truck } from "lucide-react";

interface InitiateTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InitiateTransferModal({
  open,
  onClose,
  onSuccess,
}: InitiateTransferModalProps) {
  const [sourceHubId, setSourceHubId] = useState("");
  const [destinationHubId, setDestinationHubId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [shipmentIdsInput, setShipmentIdsInput] = useState("");

  const [hubs, setHubs] = useState<IHub[]>([]);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [availableShipments, setAvailableShipments] = useState<IShipment[]>([]);
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoadingData(true);
      setError(null);
      setSourceHubId("");
      setDestinationHubId("");
      setVehicleId("");
      setRemarks("");
      setShipmentIdsInput("");
      setSelectedShipmentIds([]);

      Promise.all([
        hubApi.getAll({ limit: 100 }),
        vehicleApi.getAll({ status: "AVAILABLE", limit: 100 }),
        shipmentApi.getAllShipments({ limit: 100 }),
      ])
        .then(([hubsRes, vehiclesRes, shipmentsRes]) => {
          setHubs(hubsRes.data ?? []);
          setVehicles(vehiclesRes.data ?? []);
          // Filter shipments that can be transferred (PENDING or IN_HUB)
          const transferable = (shipmentsRes.data ?? []).filter(
            (s) => s.status === "PENDING" || s.status === "IN_HUB",
          );
          setAvailableShipments(transferable);
        })
        .catch((err) => {
          setError(err.message ?? "Failed to load hubs or vehicles");
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [open]);

  const toggleShipmentSelection = (id: string) => {
    setSelectedShipmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceHubId) {
      setError("Please select a Source Hub.");
      return;
    }
    if (!destinationHubId) {
      setError("Please select a Destination Hub.");
      return;
    }
    if (sourceHubId === destinationHubId) {
      setError("Source and Destination hubs must be different.");
      return;
    }

    // Parse shipment IDs either from selection or manual input
    const manualIds = shipmentIdsInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const allIds = Array.from(
      new Set([...selectedShipmentIds, ...manualIds]),
    );

    if (allIds.length === 0) {
      setError("Please select or enter at least one Shipment ID to transfer.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await hubTransferApi.initiate({
        sourceHubId,
        destinationHubId,
        shipmentIds: allIds,
        vehicleId: vehicleId || undefined,
        remarks: remarks.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to initiate transfer.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Initiate Hub-to-Hub Transfer"
      onClose={onClose}
      className="max-w-xl max-h-[90vh] overflow-y-auto"
    >
      {loadingData ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading hubs and available fleet...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Hub Route Selection */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Source Hub (Origin) <span className="text-destructive">*</span>
              </label>
              <select
                value={sourceHubId}
                onChange={(e) => setSourceHubId(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                required
              >
                <option value="">Select Origin Hub</option>
                {hubs.map((h) => (
                  <option key={h.id} value={h.id} className="bg-background">
                    {h.hubName} ({h.address})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Destination Hub <span className="text-destructive">*</span>
              </label>
              <select
                value={destinationHubId}
                onChange={(e) => setDestinationHubId(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                required
              >
                <option value="">Select Destination Hub</option>
                {hubs
                  .filter((h) => h.id !== sourceHubId)
                  .map((h) => (
                    <option key={h.id} value={h.id} className="bg-background">
                      {h.hubName} ({h.address})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Vehicle Assignment */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Assign Transport Vehicle (Optional)
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            >
              <option value="">No vehicle assigned / Third-party</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id} className="bg-background">
                  {v.vehicleNumber} — {v.type} {v.driverName ? `(Driver: ${v.driverName})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Shipments Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>Select Shipments to Batch Dispatch ({selectedShipmentIds.length} selected)</span>
              <span className="text-[11px] text-muted-foreground">PENDING or IN_HUB</span>
            </label>

            {availableShipments.length > 0 ? (
              <div className="max-h-40 overflow-y-auto divide-y divide-border rounded-lg border border-border bg-card p-1">
                {availableShipments.map((s) => {
                  const checked = selectedShipmentIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center justify-between p-2 text-xs hover:bg-muted/40 rounded-md cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleShipmentSelection(s.id)}
                          className="size-4 rounded border-border text-primary"
                        />
                        <span className="font-mono font-bold text-foreground">
                          {s.trackingNumber}
                        </span>
                        <span className="text-muted-foreground">
                          ({s.recipientName})
                        </span>
                      </div>
                      <span className="text-[11px] rounded bg-muted px-1.5 py-0.5">
                        {s.status}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No eligible shipments currently awaiting dispatch. You can enter shipment IDs below.
              </p>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Or enter Shipment IDs (comma or line separated):
              </label>
              <textarea
                rows={2}
                placeholder="shipment-id-1, shipment-id-2"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs font-mono shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                value={shipmentIdsInput}
                onChange={(e) => setShipmentIdsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Transfer Remarks / Route Notes (Optional)
            </label>
            <Input
              placeholder="e.g. Morning express batch transfer route A"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                  Dispatching Transfer...
                </>
              ) : (
                "Dispatch Transfer"
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
