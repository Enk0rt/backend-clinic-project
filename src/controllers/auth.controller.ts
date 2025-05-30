import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { IAuth } from "../interfaces/auth.interface";
import { IUserCreateDTO } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.body as IUserCreateDTO;
            const data = await authService.signUp(user);
            res.status(StatusCodeEnums.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const credentials = req.body as IAuth;
            const data = await authService.signIn(credentials);
            res.status(StatusCodeEnums.OK).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
