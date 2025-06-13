import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { IApiSuccessResponse } from "../interfaces/api-success-response.interface";
import {
    IUser,
    IUserQuery,
    IUserUpdateDTO,
} from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
    public async getAll(
        req: Request,
        res: Response<IApiSuccessResponse<IUser[]>>,
        next: NextFunction,
    ) {
        try {
            const query = req.query as IUserQuery;
            const { data, total, page, pageSize, totalPages } =
                await userService.getAll(query);
            res.status(StatusCodeEnums.OK).json({
                data,
                pageSize,
                page,
                totalPages,
                total,
            });
        } catch (e) {
            next(e);
        }
    }

    public async getById(
        req: Request,
        res: Response<IApiSuccessResponse<IUser>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const data = await userService.getById(id);
            res.status(StatusCodeEnums.OK).json({ data });
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IApiSuccessResponse<IUser>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const dataToUpdate = req.body as IUserUpdateDTO;
            const data = await userService.updateUser(id, dataToUpdate);
            res.status(StatusCodeEnums.OK).json({
                data,
                details: "User info is successfully updated",
            });
        } catch (e) {
            next(e);
        }
    }

    public async delete(
        req: Request,
        res: Response<IApiSuccessResponse<void | null>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await userService.delete(id);
            res.status(StatusCodeEnums.OK).json({
                data: null,
                details: "User is deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const userController = new UserController();
