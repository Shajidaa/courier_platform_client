import type { IApiResponse } from "./auth.types";
import type { TVehicleType } from "./vehicle.types";

export type TTransferStatus =
  | "PENDING"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "CANCELLED";

export interface ITransferHub {
  id: string;
  hubName: string;
  address: string;
}

export interface ITransferVehicle {
  id: string;
  vehicleNumber: string;
  type: TVehicleType;
  driverName?: string | null;
}

export interface ITransferUser {
  id: string;
  name: string;
  role: string;
}

export interface IHubTransfer {
  id: string;
  sourceHubId: string;
  destinationHubId: string;
  vehicleId?: string | null;
  status: TTransferStatus;
  dispatchedAt: string;
  receivedAt?: string | null;
  receivedById?: string | null;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
  sourceHub: ITransferHub;
  destinationHub: ITransferHub;
  vehicle?: ITransferVehicle | null;
  receivedBy?: ITransferUser | null;
}

export interface IInitiateTransferPayload {
  sourceHubId: string;
  destinationHubId: string;
  shipmentIds: string[];
  vehicleId?: string;
  remarks?: string;
}

export interface IReceiveTransferPayload {
  remarks?: string;
}

export interface ITransferListQuery {
  page?: number;
  limit?: number;
  status?: TTransferStatus;
  sourceHubId?: string;
  destinationHubId?: string;
}

export interface ITransferPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type IHubTransferResponse = IApiResponse<IHubTransfer>;
export type IHubTransferListApiResponse = IApiResponse<IHubTransfer[]> & {
  meta?: ITransferPaginationMeta;
};
