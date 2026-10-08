import type { IApiResponse } from "./auth.types"

export type TShipmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_HUB"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "FAILED"

export type TShipmentCategory =
  "DOCUMENT" | "PARCEL" | "FRAGILE" | "ELECTRONICS" | "FOOD" | "OTHER"

export type TDeliveryType = "STANDARD" | "EXPRESS" | "SAME_DAY" | "NEXT_DAY"

export type TPaymentMethod = "CASH_ON_DELIVERY" | "BKASH"

export type TPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

export interface IShipmentHub {
  id: string
  hubName: string
  address: string
}

export interface IShipmentRider {
  id: string
  vehicleType?: string
  user: {
    id: string
    name: string
  }
}

export interface IShipmentSender {
  id: string
  defaultPickupAddress?: string | null
  city?: string | null
  user: {
    id: string
    name: string
    email: string
  }
}

export interface IShipmentPayment {
  id: string
  amount: number | string
  paymentMethod: TPaymentMethod
  paymentStatus: TPaymentStatus
  transactionId?: string | null
  currency: string
  createdAt: string
}

export interface IShipmentLog {
  id: string
  status: TShipmentStatus
  note?: string | null
  createdAt: string
  updatedBy: {
    id: string
    name: string
    role: string
  }
}

export interface IShipment {
  id: string
  trackingNumber: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  minWeight: number | string
  maxWeight: number | string
  category: TShipmentCategory
  codAmount: number | string
  deliveryCharge: number | string
  status: TShipmentStatus
  deliveryType: TDeliveryType
  packageDimensions?: string | null
  estimatedDeliveryDate?: string | null
  actualDeliveryDate?: string | null
  cancellationReason?: string | null
  proofOfDelivery?: string | null
  createdAt: string
  updatedAt: string
  currentHub?: IShipmentHub | null
  assignedCourier?: IShipmentRider | null
  sender?: IShipmentSender | null
  payments?: IShipmentPayment[]
  shipmentLogs?: IShipmentLog[]
}

export interface ICreateShipmentPayload {
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  weight: number
  category?: TShipmentCategory
  packageDimensions?: string
  deliveryType?: TDeliveryType
  codAmount?: number
  paymentMethod?: TPaymentMethod
}

export interface IUpdateShipmentPayload {
  recipientName?: string
  recipientPhone?: string
  recipientAddress?: string
  packageDimensions?: string
  codAmount?: number
  category?: TShipmentCategory
  deliveryType?: TDeliveryType
}

export interface IUpdateShipmentStatusPayload {
  status: TShipmentStatus
  note?: string
  cancellationReason?: string
  hubId?: string
}

export interface IAssignRiderPayload {
  riderId: string
}

export interface IShipmentListQuery {
  page?: number
  limit?: number
  status?: TShipmentStatus
}

export interface IAdminShipmentListQuery {
  page?: number
  limit?: number
  status?: TShipmentStatus
  senderId?: string
  search?: string
}

export interface IShipmentPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface IShipmentListResponse {
  data: IShipment[]
  meta: IShipmentPaginationMeta
}

export type IShipmentResponse = IApiResponse<IShipment>
export type IShipmentListApiResponse = IApiResponse<IShipment[]> & {
  meta?: IShipmentPaginationMeta
}
