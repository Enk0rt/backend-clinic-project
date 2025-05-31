import { BaseInterface } from "./base.interface";
import { IDoctor } from "./doctor.interface";

export interface IService extends BaseInterface {
    name: string;
    doctors: IDoctor[];
}
