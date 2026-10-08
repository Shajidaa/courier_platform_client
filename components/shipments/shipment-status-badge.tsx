import { cn } from "@/lib/utils";
import type { TShipmentStatus } from "@/types/shipment.types";

const STATUS_CONFIG: Record<
  TShipmentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  PICKED_UP: {
    label: "Picked Up",
    className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  },
  IN_HUB: {
    label: "In Hub",
    className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  },
  OUT_FOR_DELIVERY: {
    label: "Out For Delivery",
    className: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  FAILED: {
    label: "Failed",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
  RETURNED: {
    label: "Returned",
    className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

interface ShipmentStatusBadgeProps {
  status: TShipmentStatus;
  className?: string;
}

export function ShipmentStatusBadge({
  status,
  className,
}: ShipmentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        config.className,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
