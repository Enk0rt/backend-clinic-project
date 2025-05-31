import { RoleEnums } from "../enums/role.enums";
import { BaseInterface } from "./base.interface";

export interface ITokens extends BaseInterface {
    _id: string;
    accessToken: string;
    refreshToken: string;
    _userId: string;
}

export type TokenModel = Pick<
    ITokens,
    "accessToken" | "refreshToken" | "_userId"
>;

export interface ITokenPayload {
    userId: string;
    role: RoleEnums;
}

export type ITokenPair = Pick<ITokens, "accessToken" | "refreshToken">;
export type IRefreshToken = Pick<ITokens, "refreshToken">;
