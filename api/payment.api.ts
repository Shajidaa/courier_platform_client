import { apiClient } from "@/lib/api-client";
import type {
  IBkashInitiateApiResponse,
  IBkashInitiatePayload,
  IPaymentStatusApiResponse,
} from "@/types/payment.types";

export const paymentApi = {
  /** POST /payments/bkash/initiate — Initiate bKash payment (Sender) */
  initiateBkash: (payload: IBkashInitiatePayload) =>
    apiClient<IBkashInitiateApiResponse>("/payments/bkash/initiate", {
      method: "POST",
      body: payload,
    }),

  /** GET /payments/:id — Get payment record status (Sender/Staff) */
  getPaymentStatus: (id: string) =>
    apiClient<IPaymentStatusApiResponse>(`/payments/${id}`),
};
