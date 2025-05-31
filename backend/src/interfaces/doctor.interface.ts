import { BaseInterface } from "./base.interface";
import { IClinic } from "./clinic.interface";
import { IService } from "./service.interface";
import { IUser } from "./user.interface";

export interface IDoctor extends BaseInterface {
    user: IUser;
    services: IService[];
    clinics: IClinic[];
}

export type IDoctorUpdateDTO = Pick<IDoctor, "services" | "clinics">;
