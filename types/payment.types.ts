import type { IApiResponse } from "./auth.types";
import type { TPaymentMethod, TPaymentStatus, TShipmentStatus } from "./shipment.types";

export interface IBkashInitiatePayload {
  shipmentId: string;
}

export interface IBkashInitiateResponse {
  bkashURL: string;
  paymentID: string;
  amount: string;
  trackingNumber: string;
  callbackURL: string;
}

export interface IPaymentRecord {
  id: string;
  shipmentId: string;
  amount: number | string;
  paymentMethod: TPaymentMethod;
  paymentStatus: TPaymentStatus;
  transactionId?: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
  shipment?: {
    id: string;
    trackingNumber: string;
    status: TShipmentStatus;
    senderId: string;
  };
}

export type IBkashInitiateApiResponse = IApiResponse<IBkashInitiateResponse>;
export type IPaymentStatusApiResponse = IApiResponse<IPaymentRecord>;
