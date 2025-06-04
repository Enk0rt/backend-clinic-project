import { BaseInterface } from "./base.interface";

export interface IClinic extends BaseInterface {
    _id: string;
    name: string;
    city: string;
    address: string;
    doctors: string[];
    services: string[];
}

export type IClinicDTO = Pick<
    IClinic,
    "name" | "city" | "address" | "doctors" | "services"
>;
