import { RoleEnums } from "../enums/role.enums";
import { BaseInterface } from "./base.interface";

export interface IUser extends BaseInterface {
    _id: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    age: number;
    phoneNumber: string;
    isActive: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    role: RoleEnums;
}

export interface IUserQuery {
    pageSize?: number;
    page?: number;
    search?: string;
    sort?: string;
    sortDirection?: "asc" | "desc" | 1 | -1;
}

export interface IUserResponse {
    data: IUser[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export type IUserUpdateDTO = Pick<
    IUser,
    "name" | "surname" | "age" | "phoneNumber"
>;

export type IUserCreateDTO = Pick<
    IUser,
    "name" | "surname" | "age" | "email" | "password" | "phoneNumber"
>;
