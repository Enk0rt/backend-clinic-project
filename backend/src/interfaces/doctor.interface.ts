import { ObjectId } from "mongodb";

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

export type IDoctorDTO = Pick<
    IDoctor,
    "_id" | "userInfo" | "phoneNumber" | "services" | "clinics"
>;
