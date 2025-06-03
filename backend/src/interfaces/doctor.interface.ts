import { ObjectId } from "mongodb";

import { BaseInterface } from "./base.interface";

export interface IDoctor extends BaseInterface {
    _id: string;
    userInfo: string;
    phoneNumber: string;
    services: ObjectId[] | string[];
    clinics: ObjectId[] | string[];
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

export interface IDoctorUpdateDTO {
    phoneNumber?: string;
    services?: string[] | string;
    clinics?: string[] | string;
}

export type IDoctorDTO = Pick<
    IDoctor,
    "_id" | "userInfo" | "phoneNumber" | "services" | "clinics"
>;
