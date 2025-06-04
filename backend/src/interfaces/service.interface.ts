import { ObjectId } from "mongodb";

import { BaseInterface } from "./base.interface";

export interface IService extends BaseInterface {
    _id: string;
    name: string;
    doctors: string[];
    clinics: ObjectId[];
}
