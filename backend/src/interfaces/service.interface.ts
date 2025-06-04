import { BaseInterface } from "./base.interface";

export interface IService extends BaseInterface {
    _id: string;
    name: string;
    doctors: string[];
    clinics: string[];
}
