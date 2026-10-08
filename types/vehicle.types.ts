import type { IApiResponse } from "./auth.types";

export type TVehicleType =
  | "BIKE"
  | "BICYCLE"
  | "SCOOTER"
  | "VAN"
  | "TRUCK"
  | "OTHER";

export type TVehicleStatus =
  | "AVAILABLE"
  | "IN_TRANSIT"
  | "MAINTENANCE"
  | "OUT_OF_SERVICE";

export interface IVehicleDriver {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IVehicleTransfer {
  id: string;
  status: string;
  sourceHubId: string;
  destinationHubId: string;
  dispatchedAt: string;
  receivedAt?: string | null;
  createdAt: string;
}

export interface IVehicle {
  id: string;
  vehicleNumber: string;
  type: TVehicleType;
  driverName?: string | null;
  capacity?: number | string | null;
  status: TVehicleStatus;
  currentDriverId?: string | null;
  currentDriver?: IVehicleDriver | null;
  transfers?: IVehicleTransfer[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateVehiclePayload {
  vehicleNumber: string;
  type: TVehicleType;
  driverName?: string;
  capacity?: number;
  currentDriverId?: string;
}

export interface IUpdateVehiclePayload {
  vehicleNumber?: string;
  type?: TVehicleType;
  driverName?: string | null;
  capacity?: number | null;
  status?: TVehicleStatus;
  currentDriverId?: string | null;
}

export interface IVehicleListQuery {
  page?: number;
  limit?: number;
  status?: TVehicleStatus;
  type?: TVehicleType;
  search?: string;
}

export interface IVehiclePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type IVehicleResponse = IApiResponse<IVehicle>;
export type IVehicleListApiResponse = IApiResponse<IVehicle[]> & {
  meta?: IVehiclePaginationMeta;
};
