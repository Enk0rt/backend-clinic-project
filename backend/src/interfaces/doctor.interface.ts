import { ObjectId } from "mongodb";

import { IApiSuccessResponse } from "./api-success-response.interface";
import { BaseInterface } from "./base.interface";

export interface IDoctor extends BaseInterface {
    _id: string;
    userInfo: string;
    phoneNumber: string;
    services: ObjectId[];
    clinics: ObjectId[];
}

export interface IDoctorCreateByAdminDTO {
    name: string;
    surname: string;
    age: number;
    email: string;
    password: string;
    phoneNumber?: string;
    services?: string[] | string;
    clinics?: string[] | string;
}

export interface IDoctorQuery {
    pageSize: number;
    page: number;
    search?: string;
    sort?: string;
    sortDirection?: "asc" | "desc" | 1 | -1;
}

export interface IDoctorUpdateDTO {
    phoneNumber?: string;
    services?: string[] | string;
    clinics?: string[] | string;
}

export interface IDoctorListResponse extends IApiSuccessResponse<IDoctor[]> {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
}

export type IDoctorDTO = Pick<
    IDoctor,
    "_id" | "userInfo" | "phoneNumber" | "services" | "clinics"
>;
