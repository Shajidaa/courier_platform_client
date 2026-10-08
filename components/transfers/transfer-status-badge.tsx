import { cn } from "@/lib/utils";
import type { TTransferStatus } from "@/types/hub-transfer.types";

const STATUS_CONFIG: Record<
  TTransferStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  DISPATCHED: {
    label: "Dispatched",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  },
  RECEIVED: {
    label: "Received",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

interface TransferStatusBadgeProps {
  status: TTransferStatus;
  className?: string;
}

export function TransferStatusBadge({
  status,
  className,
}: TransferStatusBadgeProps) {
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
