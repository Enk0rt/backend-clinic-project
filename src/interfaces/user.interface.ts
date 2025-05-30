import { RoleEnums } from "../enums/role.enums";
import { BaseInterface } from "./base.interface";

export interface IUser extends BaseInterface {
    _id: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    age: number;
    isActive: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    role: RoleEnums;
}

export type IUserUpdateDTO = Pick<IUser, "name" | "surname" | "age">;

export type IUserCreateDTO = Pick<
    IUser,
    "name" | "surname" | "age" | "email" | "password"
>;
