"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Phone,
  User,
  Scale,
  Zap,
  Clock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shipmentApi } from "@/api/shipment.api";
import {
  TDeliveryType,
  TPaymentMethod,
  TShipmentCategory,
} from "@/types/shipment.types";

const CATEGORIES: { label: string; value: TShipmentCategory }[] = [
  { label: "General Parcel", value: "PARCEL" },
  { label: "Document / Envelope", value: "DOCUMENT" },
  { label: "Fragile / Glassware", value: "FRAGILE" },
  { label: "Electronics / Gadgets", value: "ELECTRONICS" },
  { label: "Food / Perishable", value: "FOOD" },
  { label: "Other", value: "OTHER" },
];

const DELIVERY_TYPES: {
  id: TDeliveryType;
  label: string;
  desc: string;
  time: string;
  multiplier: number;
}[] = [
  {
    id: "STANDARD",
    label: "Standard Delivery",
    desc: "Regular shipping via ground logistics",
    time: "3–5 Days",
    multiplier: 1.0,
  },
  {
    id: "EXPRESS",
    label: "Express Courier",
    desc: "Fast prioritized dispatch",
    time: "2 Days",
    multiplier: 1.5,
  },
  {
    id: "NEXT_DAY",
    label: "Next Day Priority",
    desc: "Guaranteed next day delivery",
    time: "Next Day",
    multiplier: 1.75,
  },
  {
    id: "SAME_DAY",
    label: "Same Day Lightning",
    desc: "Direct express city delivery",
    time: "Within Today",
    multiplier: 2.0,
  },
];

export function BookShipmentForm() {
  const router = useRouter();

  // Form states
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [weight, setWeight] = useState<number>(1);
  const [category, setCategory] = useState<TShipmentCategory>("PARCEL");
  const [dimensions, setDimensions] = useState("");
  const [deliveryType, setDeliveryType] = useState<TDeliveryType>("STANDARD");
  const [codAmount, setCodAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] =
    useState<TPaymentMethod>("BKASH");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successShipment, setSuccessShipment] = useState<{
    id: string;
    trackingNumber: string;
  } | null>(null);

  // Live price calculation matching backend
  const calculateCharge = (w: number, type: TDeliveryType) => {
    const BASE_RATE = 60; // BDT per KG
    const MINIMUM_CHARGE = 60;
    const item = DELIVERY_TYPES.find((d) => d.id === type) || DELIVERY_TYPES[0];
    const raw = Math.max(w * BASE_RATE, MINIMUM_CHARGE);
    return Math.round(raw * item.multiplier);
  };

  const deliveryCharge = calculateCharge(weight, deliveryType);
  const totalPayable = deliveryCharge + (Number(codAmount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedPhone = recipientPhone.replace(/[\s-]/g, "");
    const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;

    if (!recipientName.trim()) {
      setError("Recipient name is required (at least 2 characters).");
      return;
    }
    if (!cleanedPhone) {
      setError("Recipient phone number is required.");
      return;
    }
    if (!phoneRegex.test(cleanedPhone)) {
      setError("Please enter a valid Bangladeshi phone number (e.g. 01712345678 or +8801712345678).");
      return;
    }
    if (!recipientAddress.trim() || recipientAddress.trim().length < 5) {
      setError("Recipient delivery address is required (at least 5 characters).");
      return;
    }
    if (weight <= 0) {
      setError("Weight must be greater than 0 kg.");
      return;
    }

    setLoading(true);

    try {
      const res = await shipmentApi.create({
        recipientName: recipientName.trim(),
        recipientPhone: cleanedPhone,
        recipientAddress: recipientAddress.trim(),
        weight: Number(weight),
        category,
        packageDimensions: dimensions.trim() || undefined,
        deliveryType,
        codAmount: Number(codAmount) || 0,
        paymentMethod,
      });

      if (res.data) {
        setSuccessShipment({
          id: res.data.id,
          trackingNumber: res.data.trackingNumber,
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to book shipment.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (successShipment) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
          Parcel Booked Successfully!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your shipment has been registered and is pending courier pickup.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tracking Number
          </span>
          <p className="mt-1 font-mono text-xl font-bold text-primary">
            {successShipment.trackingNumber}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.push("/dashboard/sender/shipments")}
            variant="default"
          >
            View My Shipments
          </Button>
          <Button
            onClick={() => {
              setSuccessShipment(null);
              setRecipientName("");
              setRecipientPhone("");
              setRecipientAddress("");
              setWeight(1);
              setCodAmount(0);
            }}
            variant="outline"
          >
            Book Another Shipment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main form details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recipient Details */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <User className="size-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground text-lg">
                Recipient Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Recipient Name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Jane Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Recipient Phone <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. +8801700000000"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Delivery Address <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                placeholder="House, Road, Area, City, Postal Code"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Package Specifications */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Package className="size-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground text-lg">
                Package Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as TShipmentCategory)
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-background">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Weight (KG) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Dimensions (L×W×H cm)
                </label>
                <Input
                  placeholder="e.g. 20x15x10"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Cash on Delivery (COD) Amount (BDT)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0 if prepaid"
                  value={codAmount}
                  onChange={(e) => setCodAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as TPaymentMethod)
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                >
                  {/* <option value="CASH_ON_DELIVERY" className="bg-background">
                    Cash on Delivery (COD)
                  </option> */}
                  <option value="BKASH" className="bg-background">
                    bKash Online Payment
                  </option>
                  {/* <option value="CARD" className="bg-background">
                    Credit / Debit Card
                  </option> */}
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Speed Options */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Zap className="size-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground text-lg">
                Delivery Speed & Service
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DELIVERY_TYPES.map((d) => {
                const isSelected = deliveryType === d.id;
                const charge = calculateCharge(weight, d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDeliveryType(d.id)}
                    className={`flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="font-semibold text-foreground text-sm">
                        {d.label}
                      </span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        ৳{charge}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-foreground/80">
                      <Clock className="size-3 text-muted-foreground" />
                      <span>{d.time}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Summary Card */}
        <div className="space-y-6">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <h3 className="font-heading font-semibold text-foreground text-lg border-b border-border pb-3">
              Pricing Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Base Delivery ({weight} kg)</span>
                <span className="font-medium text-foreground">৳{deliveryCharge}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Speed Tier</span>
                <span className="font-medium text-foreground">
                  {DELIVERY_TYPES.find((d) => d.id === deliveryType)?.label}
                </span>
              </div>
              {codAmount > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>COD Collection</span>
                  <span className="font-medium text-foreground">৳{codAmount}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex items-center justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-xl font-extrabold text-primary">
                  ৳{totalPayable}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span>Courier Platform Guarantee</span>
              </div>
              <p>
                Automatic tracking updates and SMS/Email verification enabled on booking.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full text-base font-semibold shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Processing Booking...
                </>
              ) : (
                "Confirm & Book Shipment"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
