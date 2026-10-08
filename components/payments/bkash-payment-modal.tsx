"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { paymentApi } from "@/api/payment.api";
import type { IBkashInitiateResponse } from "@/types/payment.types";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, ShieldCheck, Wallet } from "lucide-react";

interface BkashPaymentModalProps {
  shipmentId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BkashPaymentModal({
  shipmentId,
  open,
  onClose,
  onSuccess,
}: BkashPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<IBkashInitiateResponse | null>(null);

  const handleInitiate = async () => {
    if (!shipmentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await paymentApi.initiateBkash({ shipmentId });
      if (res.data) {
        setPaymentData(res.data);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to initiate bKash payment.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentData(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="bKash Online Payment"
      onClose={handleClose}
      className="max-w-md text-center"
    >
      <div className="space-y-5 text-sm">
        {/* bKash Header Icon */}
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#D12053]/10 text-[#D12053]">
          <Wallet className="size-7" />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive text-left">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {paymentData ? (
          <div className="space-y-4 text-left">
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tracking Number</span>
                <span className="font-mono font-bold text-foreground">
                  {paymentData.trackingNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Payment ID</span>
                <span className="font-mono text-foreground">{paymentData.paymentID}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base font-bold text-foreground">
                <span>Payable Amount</span>
                <span className="text-primary font-extrabold">
                  ৳{paymentData.amount}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Secure SSL encrypted sandbox gateway ready.</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                asChild
                size="lg"
                className="w-full bg-[#D12053] hover:bg-[#b01642] text-white font-semibold gap-2"
              >
                <a
                  href={paymentData.bkashURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (onSuccess) onSuccess();
                  }}
                >
                  <span>Proceed to bKash Gateway</span>
                  <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-xs">
              Click below to generate a secure bKash checkout session for this shipment.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleInitiate}
                disabled={loading}
                className="bg-[#D12053] hover:bg-[#b01642] text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Initializing bKash...
                  </>
                ) : (
                  "Pay with bKash"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
