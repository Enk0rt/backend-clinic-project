import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { IUserUpdateDTO } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await userService.getAll();
            res.status(StatusCodeEnums.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await userService.getById(id);
            res.status(StatusCodeEnums.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = req.body as IUserUpdateDTO;
            const updatedUser = await userService.updateUser(id, data);
            res.status(StatusCodeEnums.OK).json(updatedUser);
        } catch (e) {
            next(e);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await userService.delete(id);
            res.status(StatusCodeEnums.OK).json();
        } catch (e) {
            next(e);
        }
    }
}

export const userController = new UserController();
