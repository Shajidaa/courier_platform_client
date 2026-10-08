import type { IApiResponse } from "./auth.types";

export interface IAreaHub {
  id: string;
  hubName: string;
  address: string;
  manager?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface IArea {
  id: string;
  name: string;
  postalCode: string;
  hubId: string;
  hub: IAreaHub;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAreaPayload {
  name: string;
  postalCode: string;
  hubId: string;
}

export interface IAreaListQuery {
  page?: number;
  limit?: number;
  hubId?: string;
  search?: string;
}

export interface IAreaPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type IAreaResponse = IApiResponse<IArea>;
export type IAreaListApiResponse = IApiResponse<IArea[]> & {
  meta?: IAreaPaginationMeta;
};
