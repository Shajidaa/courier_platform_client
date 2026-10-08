"use client";

import { useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { shipmentApi } from "@/api/shipment.api";
import type { IShipment } from "@/types/shipment.types";

export function TrackShipmentSection() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [shipment, setShipment] = useState<IShipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingNumber.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setShipment(null);

    try {
      // Try searching via public search / admin query or by direct match
      const res = await shipmentApi.getAllShipments({ search: query, limit: 1 });
      const found = res.data && res.data.length > 0 ? res.data[0] : null;

      if (found) {
        // Fetch full tracking detail with logs
        const detailRes = await shipmentApi.getById(found.id);
        setShipment(detailRes.data ?? found);
      } else {
        setError(`No shipment found matching tracking number "${query}". Please check the number.`);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to look up tracking details right now.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Tracking Card */}
        <div className="rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <div className="text-center max-w-xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              <Package className="size-3.5" />
              <span>Live Parcel Tracking</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Track Your Package in Real-Time
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your unique tracking number to view real-time location, hub check-ins, and delivery estimates.
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter Tracking No (e.g. TRK-2026-XXXXX)..."
                className="pl-11 h-12 text-base rounded-xl font-mono shadow-xs"
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-12 px-8 rounded-xl font-semibold shadow-md shrink-0 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <span>Track Parcel</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Results Area */}
          {searched && (
            <div className="mt-8 border-t border-border pt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="size-7 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Searching courier database...</p>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive max-w-xl mx-auto">
                  <AlertCircle className="size-5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : shipment ? (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-5">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tracking Number
                      </span>
                      <p className="font-mono text-xl font-bold text-foreground">
                        {shipment.trackingNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block mb-1">
                        Current Status
                      </span>
                      <ShipmentStatusBadge
                        status={shipment.status}
                        className="text-sm py-1 px-3"
                      />
                    </div>
                  </div>

                  {/* Route & Hub Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 text-primary" />
                        <span>Delivery Destination</span>
                      </div>
                      <p className="font-semibold text-foreground text-sm">
                        {shipment.recipientName}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {shipment.recipientAddress}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="size-3.5 text-primary" />
                        <span>Current Logistics Hub</span>
                      </div>
                      <p className="font-semibold text-foreground text-sm">
                        {shipment.currentHub ? shipment.currentHub.hubName : "In Ground Transit"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shipment.currentHub ? shipment.currentHub.address : "Routing to local center"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5 text-primary" />
                        <span>Delivery Estimation</span>
                      </div>
                      <p className="font-semibold text-foreground text-sm">
                        {shipment.estimatedDeliveryDate
                          ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString()
                          : "Scheduled"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Service: {shipment.deliveryType.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {shipment.shipmentLogs && shipment.shipmentLogs.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                      <h4 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
                        <Clock className="size-4 text-primary" /> Status History
                      </h4>
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        {shipment.shipmentLogs.map((log) => (
                          <div key={log.id} className="relative group">
                            <div className="absolute -left-6 top-1 size-4 rounded-full bg-primary ring-4 ring-background" />
                            <div>
                              <div className="flex items-center gap-2">
                                <ShipmentStatusBadge status={log.status} />
                                <span className="text-[11px] text-muted-foreground">
                                  {new Date(log.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-foreground font-medium">
                                {log.note}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
