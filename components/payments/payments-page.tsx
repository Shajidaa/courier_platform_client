"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "./payment-status-badge";
import { BkashPaymentModal } from "./bkash-payment-modal";
import { useShipments } from "@/hooks/use-shipments";
import type { IShipment } from "@/types/shipment.types";

function PaymentsPageContent({ isSender = true }: { isSender?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { shipments, isLoading, error, refetch } = useShipments({
    isSender,
    initialLimit: 50,
  });

  const [selectedPayShipmentId, setSelectedPayShipmentId] = useState<string | null>(null);
  const [bkashModalOpen, setBkashModalOpen] = useState(false);

  // Search parameters from payment return callback
  const paymentStatusParam = searchParams.get("paymentStatus");
  const messageParam = searchParams.get("message");
  const trxIDParam = searchParams.get("trxID");
  const amountParam = searchParams.get("amount");

  const [notification, setNotification] = useState<{
    type: "success" | "failed";
    message: string;
    trxID?: string;
    amount?: string;
  } | null>(null);

  useEffect(() => {
    if (paymentStatusParam === "success") {
      setNotification({
        type: "success",
        message: messageParam || "Payment completed successfully.",
        trxID: trxIDParam || undefined,
        amount: amountParam || undefined,
      });
      refetch();
    } else if (paymentStatusParam === "failed") {
      setNotification({
        type: "failed",
        message: messageParam || "Payment was cancelled or failed. No charge was made.",
      });
    }
  }, [paymentStatusParam, messageParam, trxIDParam, amountParam, refetch]);

  const handleDismissNotification = () => {
    setNotification(null);
    router.replace("/dashboard/sender/payments");
  };

  // Extract payment records from shipments
  const paymentsList = shipments.flatMap((s) =>
    (s.payments || []).map((p) => ({
      ...p,
      shipment: s,
    })),
  );

  const totalPaid = paymentsList
    .filter((p) => p.paymentStatus === "PAID")
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const totalPending = paymentsList
    .filter((p) => p.paymentStatus === "PENDING")
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const handlePay = (shipmentId: string) => {
    setSelectedPayShipmentId(shipmentId);
    setBkashModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Payments & Billing
        </h2>
        <p className="text-sm text-muted-foreground">
          View transaction records, delivery charges, COD settlements, and bKash receipts.
        </p>
      </div>

      {/* Payment Callback Notification Banner */}
      {notification && (
        <div
          className={`flex items-start justify-between rounded-2xl border p-4 shadow-xs transition-all ${
            notification.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                notification.type === "success"
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-heading text-sm font-bold">
                {notification.type === "success"
                  ? "bKash Payment Completed Successfully"
                  : "Payment Not Completed"}
              </h4>
              <p className="text-xs opacity-90 leading-relaxed">
                {notification.message}
                {notification.trxID && (
                  <span className="ml-2 font-mono font-semibold">
                    (TrxID: {notification.trxID})
                  </span>
                )}
                {notification.amount && (
                  <span className="ml-2 font-bold">• ৳{notification.amount}</span>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 opacity-70 hover:opacity-100"
            onClick={handleDismissNotification}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Transactions
            </span>
            <Wallet className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {paymentsList.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Paid
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            ৳{totalPaid.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pending Payments
            </span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            ৳{totalPending.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Payments Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Tracking Number</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span>Loading payment records...</span>
                    </div>
                  </td>
                </tr>
              ) : paymentsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <DollarSign className="size-10 stroke-1 text-muted-foreground/60" />
                      <p className="font-medium text-foreground">No payment records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paymentsList.map((p) => (
                  <tr key={p.id} className="transition hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-primary">
                        {p.shipment?.trackingNumber}
                      </span>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {p.shipment?.recipientName}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {p.paymentMethod.replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {p.transactionId || "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-foreground">
                      ৳{Number(p.amount).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <PaymentStatusBadge status={p.paymentStatus} />
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {p.paymentStatus === "PENDING" && isSender ? (
                        <Button
                          size="sm"
                          onClick={() => handlePay(p.shipment.id)}
                          className="bg-[#D12053] hover:bg-[#b01642] text-white text-xs h-7 gap-1"
                        >
                          <span>Pay bKash</span>
                          <ExternalLink className="size-3" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">
                          Receipt Ready
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* bKash Modal */}
      <BkashPaymentModal
        shipmentId={selectedPayShipmentId}
        open={bkashModalOpen}
        onClose={() => {
          setBkashModalOpen(false);
          setSelectedPayShipmentId(null);
        }}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export function PaymentsPage({ isSender = true }: { isSender?: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentsPageContent isSender={isSender} />
    </Suspense>
  );
}
