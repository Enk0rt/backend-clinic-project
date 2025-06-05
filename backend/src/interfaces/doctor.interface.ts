import { ObjectId } from "mongodb";

import { BaseInterface } from "./base.interface";

export interface IDoctor extends BaseInterface {
    _id: string;
    userInfo: string;
    services: ObjectId[];
    clinics: ObjectId[];
}

export interface IDoctorCreateByAdminDTO {
    _id: string;
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
    pageSize?: number;
    page?: number;
    search?: string;
    sort?: string;
    sortDirection?: "asc" | "desc" | 1 | -1;
}

export interface IDoctorResponse {
    data: IDoctor[];
    pageSize: number;
    page: number;
    totalPages: number;
    total: number;
}

export interface IDoctorUpdateDTO {
    services?: string[] | string;
    clinics?: string[] | string;
}
