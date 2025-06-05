import { ObjectId } from "mongodb";

import { BaseInterface } from "./base.interface";

export interface IClinic extends BaseInterface {
    _id: string;
    name: string;
    city: string;
    address: string;
    doctors: string[];
    services: ObjectId[];
}

export interface IClinicQuery {
    pageSize?: number;
    page?: number;
    sort?: string;
    search?: string;
    sortDirection?: "desc" | "asc" | 1 | -1;
}

export interface IClinicResponse {
    data: IClinic[];
    pageSize: number;
    page: number;
    totalPages: number;
    total: number;
}

export type IClinicDTO = Pick<
    IClinic,
    "name" | "city" | "address" | "doctors" | "services"
>;
