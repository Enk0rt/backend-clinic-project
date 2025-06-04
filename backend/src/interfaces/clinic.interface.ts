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

export type IClinicDTO = Pick<
    IClinic,
    "name" | "city" | "address" | "doctors" | "services"
>;
