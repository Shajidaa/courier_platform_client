"use client";

import { useEffect, useState, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shipmentApi } from "@/api/shipment.api";
import { userApi } from "@/api/user.api";
import type { IShipment } from "@/types/shipment.types";
import type { IRider } from "@/types/user.types";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Search,
  Truck,
  User,
  Building2,
  Mail,
  Check,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignRiderModalProps {
  shipment: IShipment | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignRiderModal({
  shipment,
  open,
  onClose,
  onSuccess,
}: AssignRiderModalProps) {
  const [selectedRiderId, setSelectedRiderId] = useState<string>("");
  const [riders, setRiders] = useState<IRider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHubFilter, setSelectedHubFilter] = useState<string>("ALL");
  const [fetchingRiders, setFetchingRiders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch registered riders when modal opens
  useEffect(() => {
    if (open && shipment) {
      setSelectedRiderId(shipment.assignedCourier?.id || "");
      setSearchQuery("");
      setSelectedHubFilter("ALL");
      setError(null);
      setFetchingRiders(true);

      userApi
        .getRiders()
        .then((res) => {
          setRiders(res.data ?? []);
        })
        .catch((err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Failed to load registered riders."
          );
        })
        .finally(() => {
          setFetchingRiders(false);
        });
    }
  }, [open, shipment]);

  // Unique hubs list for filter chips
  const hubList = useMemo(() => {
    const hubs = new Set<string>();
    riders.forEach((r) => {
      if (r.hubName) hubs.add(r.hubName);
    });
    return Array.from(hubs);
  }, [riders]);

  // Filter riders by search query and hub filter
  const filteredRiders = useMemo(() => {
    return riders.filter((r) => {
      const matchesHub =
        selectedHubFilter === "ALL" || r.hubName === selectedHubFilter;

      if (!matchesHub) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.address && r.address.toLowerCase().includes(q)) ||
        (r.hubName && r.hubName.toLowerCase().includes(q)) ||
        (r.hubCity && r.hubCity.toLowerCase().includes(q)) ||
        (r.vehicleNumber && r.vehicleNumber.toLowerCase().includes(q)) ||
        (r.vehicleType && r.vehicleType.toLowerCase().includes(q))
      );
    });
  }, [riders, searchQuery, selectedHubFilter]);

  const selectedRider = useMemo(() => {
    return riders.find((r) => r.id === selectedRiderId);
  }, [riders, selectedRiderId]);

  // Direct assign action
  const handleAssignRider = async (targetRiderId: string) => {
    if (!shipment || !targetRiderId) return;

    setError(null);
    setSubmitting(true);
    setSelectedRiderId(targetRiderId);

    try {
      await shipmentApi.assignRider(shipment.id, {
        riderId: targetRiderId.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to assign rider courier.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRiderId) {
      await handleAssignRider(selectedRiderId);
    } else {
      setError("Please choose a rider to assign from the list.");
    }
  };

  return (
    <Modal
      open={open}
      title="Assign Courier Rider"
      onClose={onClose}
      className="max-w-2xl max-h-[90vh] flex flex-col"
    >
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-sm flex-1 min-h-0">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive shrink-0">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Shipment Delivery Context Header */}
        {shipment && (
          <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-2 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Tracking:</span>
                <span className="font-mono font-bold text-primary text-sm">
                  {shipment.trackingNumber}
                </span>
              </div>
              {shipment.assignedCourier && (
                <div className="flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Truck className="size-3" />
                  <span>Current: {shipment.assignedCourier.user.name}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-1.5 text-muted-foreground">
                <User className="size-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-foreground">Recipient:</span>{" "}
                  {shipment.recipientName} ({shipment.recipientPhone})
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="truncate">
                  <span className="font-medium text-foreground">Destination:</span>{" "}
                  <span className="text-foreground font-medium">{shipment.recipientAddress}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Section */}
        <div className="space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Select Rider from Active Fleet
            </label>
            <span className="text-[11px] text-muted-foreground">
              Showing {filteredRiders.length} of {riders.length} active riders
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, address, phone number, hub, or vehicle..."
              className="pl-9 h-9 text-xs rounded-xl"
            />
          </div>

          {/* Hub Filter Chips */}
          {hubList.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedHubFilter("ALL")}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0",
                  selectedHubFilter === "ALL"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                All Hubs ({riders.length})
              </button>
              {hubList.map((hub) => {
                const count = riders.filter((r) => r.hubName === hub).length;
                return (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => setSelectedHubFilter(hub)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0",
                      selectedHubFilter === hub
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {hub} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Rider Cards List (Scrollable) */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 flex-1">
          {fetchingRiders ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs">Loading available fleet riders...</span>
            </div>
          ) : filteredRiders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-2">
              <UserCheck className="size-8 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground">No matching riders found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try searching with a different name, address, phone number, or select &quot;All Hubs&quot;.
              </p>
            </div>
          ) : (
            filteredRiders.map((rider) => {
              const isSelected = selectedRiderId === rider.id;
              const isCurrentShipmentRider = shipment?.assignedCourier?.id === rider.id;
              const initials = rider.name
                ? rider.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "R";

              return (
                <div
                  key={rider.id}
                  onClick={() => setSelectedRiderId(rider.id)}
                  className={cn(
                    "group relative flex items-center justify-between gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-150 text-left",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  {/* Left: Avatar & Rider Details */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Rider Avatar with Online Status */}
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-xl font-bold text-xs shadow-xs",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {initials}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </div>

                    {/* Information Body */}
                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Name & Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {rider.name}
                        </span>
                        {isCurrentShipmentRider && (
                          <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            Currently Assigned
                          </span>
                        )}
                        {rider.totalDeliveries !== undefined && rider.totalDeliveries > 0 && (
                          <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            {rider.totalDeliveries} Deliveries
                          </span>
                        )}
                      </div>

                      {/* Contact: Phone & Email */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        {rider.phone ? (
                          <span className="flex items-center gap-1 font-medium text-foreground/90">
                            <Phone className="size-3 text-muted-foreground" />
                            <span>{rider.phone}</span>
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Mail className="size-3 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{rider.email}</span>
                        </span>
                      </div>

                      {/* Location & Vehicle specs */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary shrink-0" />
                          <span className="font-medium text-foreground">
                            {rider.address || rider.hubCity || "City Area"}
                          </span>
                        </span>

                        {rider.hubName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3 text-indigo-500 shrink-0" />
                            <span>{rider.hubName}</span>
                          </span>
                        )}

                        {rider.vehicleType && (
                          <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                            <Truck className="size-3 shrink-0" />
                            <span>
                              {rider.vehicleType} {rider.vehicleNumber ? `(${rider.vehicleNumber})` : ""}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Instant Assign Action Button */}
                  <div className="shrink-0 flex items-center pl-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      disabled={submitting}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignRider(rider.id);
                      }}
                      className={cn(
                        "h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 transition-all",
                        isSelected
                          ? "shadow-sm shadow-primary/20"
                          : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      )}
                    >
                      {submitting && selectedRiderId === rider.id ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Assigning...</span>
                        </>
                      ) : isSelected ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="size-3.5" />
                          <span>Assign</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Confirmation Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border shrink-0">
          <div className="text-xs">
            {selectedRider ? (
              <span className="text-foreground">
                Selected: <strong className="text-primary">{selectedRider.name}</strong>{" "}
                <span className="text-muted-foreground">
                  ({selectedRider.address || selectedRider.hubName || selectedRider.email})
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">Click a rider above to select and assign</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !selectedRiderId}
              className="gap-1.5 font-semibold shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Confirm & Assign</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
