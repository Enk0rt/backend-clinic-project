import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/tokens.interface";
import { IUserCreateDTO } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as IUserCreateDTO;
            const data = await authService.signUp(body);
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

    public async me(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
            const { userId } = tokenPayload;
            const user = await userService.getById(userId);
            res.status(StatusCodeEnums.OK).json(user);
        } catch {
            throw new ApiError(
                StatusCodeEnums.UNAUTHORIZED,
                "User is not signed in",
            );
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, role } = req.res.locals
                .tokenPayload as ITokenPayload;
            const tokens = tokenService.generateTokens({
                userId,
                role,
            });
            res.status(StatusCodeEnums.OK).json({ tokens: tokens });
        } catch (e) {
            next(e);
        }
    }

    public async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const user = await authService.activate(token);
            res.status(StatusCodeEnums.OK).json(user);
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
