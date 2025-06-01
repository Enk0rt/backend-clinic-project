import { ObjectId } from "mongodb";

import { BaseInterface } from "./base.interface";
import { IClinic } from "./clinic.interface";
import { IService } from "./service.interface";

export interface IDoctor extends BaseInterface {
    _id: string;
    userInfo: ObjectId;
    phoneNumber: string;
    services: IService[];
    clinics: IClinic[];
}

export type IDoctorDTO = Pick<IDoctor, "phoneNumber" | "services" | "clinics">;
