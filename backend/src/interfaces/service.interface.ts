import { ObjectId } from "mongodb";

import { IApiSuccessResponse } from "./api-success-response.interface";
import { BaseInterface } from "./base.interface";

export interface IService extends BaseInterface {
    _id: string;
    name: string;
    doctors: string[];
    clinics: ObjectId[];
}

export interface IServiceQuery {
    pageSize: number;
    page: number;
    search?: string;
    sort?: string;
    sortDirection?: "asc" | "desc" | 1 | -1;
}

export interface IServiceListResponse extends IApiSuccessResponse<IService[]> {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
}
