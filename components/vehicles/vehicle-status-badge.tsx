import { cn } from "@/lib/utils";
import type { TVehicleStatus } from "@/types/vehicle.types";

const STATUS_CONFIG: Record<
  TVehicleStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  MAINTENANCE: {
    label: "Maintenance",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  OUT_OF_SERVICE: {
    label: "Out of Service",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
};

interface VehicleStatusBadgeProps {
  status: TVehicleStatus;
  className?: string;
}

export function VehicleStatusBadge({
  status,
  className,
}: VehicleStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        config.className,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
