import { BaseInterface } from "./base.interface";
import { IDoctor } from "./doctor.interface";
import { IService } from "./service.interface";

export interface IClinic extends BaseInterface {
    name: string;
    city: string;
    doctors: IDoctor[];
    services: IService[];
}
