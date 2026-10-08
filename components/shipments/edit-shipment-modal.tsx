"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shipmentApi } from "@/api/shipment.api";
import type {
  IShipment,
  TDeliveryType,
  TShipmentCategory,
} from "@/types/shipment.types";
import { AlertCircle, Loader2 } from "lucide-react";

const CATEGORIES: { label: string; value: TShipmentCategory }[] = [
  { label: "General Parcel", value: "PARCEL" },
  { label: "Document / Envelope", value: "DOCUMENT" },
  { label: "Fragile / Glassware", value: "FRAGILE" },
  { label: "Electronics / Gadgets", value: "ELECTRONICS" },
  { label: "Food / Perishable", value: "FOOD" },
  { label: "Other", value: "OTHER" },
];

const DELIVERY_TYPES: { id: TDeliveryType; label: string }[] = [
  { id: "STANDARD", label: "Standard Delivery (3-5 Days)" },
  { id: "EXPRESS", label: "Express Courier (2 Days)" },
  { id: "NEXT_DAY", label: "Next Day Priority" },
  { id: "SAME_DAY", label: "Same Day Lightning" },
];

interface EditShipmentModalProps {
  shipment: IShipment | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditShipmentModal({
  shipment,
  open,
  onClose,
  onSuccess,
}: EditShipmentModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [codAmount, setCodAmount] = useState<number>(0);
  const [category, setCategory] = useState<TShipmentCategory>("PARCEL");
  const [deliveryType, setDeliveryType] = useState<TDeliveryType>("STANDARD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shipment && open) {
      setRecipientName(shipment.recipientName || "");
      setRecipientPhone(shipment.recipientPhone || "");
      setRecipientAddress(shipment.recipientAddress || "");
      setDimensions(shipment.packageDimensions || "");
      setCodAmount(Number(shipment.codAmount) || 0);
      setCategory(shipment.category || "PARCEL");
      setDeliveryType(shipment.deliveryType || "STANDARD");
      setError(null);
    }
  }, [shipment, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    setError(null);
    setLoading(true);

    try {
      await shipmentApi.update(shipment.id, {
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        recipientAddress: recipientAddress.trim(),
        packageDimensions: dimensions.trim() || undefined,
        codAmount: Number(codAmount),
        category,
        deliveryType,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update shipment.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`Edit Shipment: ${shipment?.trackingNumber || ""}`}
      onClose={onClose}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Recipient Name
            </label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Recipient Phone
            </label>
            <Input
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Delivery Address
          </label>
          <textarea
            rows={2}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TShipmentCategory)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-background">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Delivery Speed
            </label>
            <select
              value={deliveryType}
              onChange={(e) =>
                setDeliveryType(e.target.value as TDeliveryType)
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            >
              {DELIVERY_TYPES.map((d) => (
                <option key={d.id} value={d.id} className="bg-background">
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              Dimensions (L×W×H cm)
            </label>
            <Input
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 20x15x10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
              COD Amount (BDT)
            </label>
            <Input
              type="number"
              min="0"
              value={codAmount}
              onChange={(e) => setCodAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>
        </div>

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
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
