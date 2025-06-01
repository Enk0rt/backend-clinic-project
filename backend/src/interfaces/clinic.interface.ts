import { BaseInterface } from "./base.interface";
import { IDoctor } from "./doctor.interface";
import { IService } from "./service.interface";

export interface IClinic extends BaseInterface {
    _id: string;
    name: string;
    city: string;
    address: string;
    doctors: IDoctor[];
    services: IService[];
}

export type IClinicDTO = Pick<IClinic, "name" | "city" | "address" | "doctors">;
