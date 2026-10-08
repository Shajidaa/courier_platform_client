import { cn } from "@/lib/utils";
import type { TPaymentStatus } from "@/types/shipment.types";

const STATUS_CONFIG: Record<
  TPaymentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  PAID: {
    label: "Paid",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  FAILED: {
    label: "Failed",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
};

interface PaymentStatusBadgeProps {
  status: TPaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
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
