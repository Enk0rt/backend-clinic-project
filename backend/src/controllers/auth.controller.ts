import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IApiSuccessResponse } from "../interfaces/api-success-response.interface";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair, ITokenPayload } from "../interfaces/tokens.interface";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthController {
    public async signUp(
        req: Request,
        res: Response<
            IApiSuccessResponse<{
                user: IUser;
                verifyToken: string;
            }>
        >,
        next: NextFunction,
    ) {
        try {
            const body = req.body as IUserCreateDTO;
            const { user, verifyToken } = await authService.signUp(body);
            res.status(StatusCodeEnums.CREATED).json({
                data: { user, verifyToken },
                details: "Sign up is successful, user is created",
            });
        } catch (e) {
            next(e);
        }
    }

    public async signIn(
        req: Request,
        res: Response<
            IApiSuccessResponse<{
                user: IUser;
                tokens: ITokenPair;
            }>
        >,
        next: NextFunction,
    ) {
        try {
            const credentials = req.body as IAuth;
            const data = await authService.signIn(credentials);
            res.status(StatusCodeEnums.OK).json({
                data,
                details: "Sign in is successful",
            });
        } catch (e) {
            next(e);
        }
    }

    public async me(
        req: Request,
        res: Response<IApiSuccessResponse<IUser>>,
        next: NextFunction,
    ) {
        try {
            const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
            const { userId } = tokenPayload;
            const user = await userService.getById(userId);
            res.status(StatusCodeEnums.OK).json({ data: user });
        } catch {
            throw new ApiError(
                StatusCodeEnums.UNAUTHORIZED,
                "User is not signed in",
            );
        }
    }

    public async deleteMe(
        req: Request,
        res: Response<IApiSuccessResponse<IUser>>,
        next: NextFunction,
    ) {
        try {
            const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
            const { userId } = tokenPayload;
            await userService.delete(userId);
            res.status(StatusCodeEnums.OK).json({
                data: null,
                details: "User is deleted successfully",
            });
        } catch {
            throw new ApiError(
                StatusCodeEnums.UNAUTHORIZED,
                "User is not signed in",
            );
        }
    }

    public async refresh(
        req: Request,
        res: Response<IApiSuccessResponse<ITokenPair>>,
        next: NextFunction,
    ) {
        try {
            const { userId, role } = req.res.locals
                .tokenPayload as ITokenPayload;
            const tokens = tokenService.generateTokens({
                userId,
                role,
            });
            res.status(StatusCodeEnums.OK).json({
                data: tokens,
                details: "Refresh is successful",
            });
        } catch (e) {
            next(e);
        }
    }

    public async verify(
        req: Request,
        res: Response<IApiSuccessResponse<IUser>>,
        next: NextFunction,
    ) {
        try {
            const { token } = req.params;
            const user = await authService.verify(token);
            res.status(StatusCodeEnums.OK).json({
                data: user,
                details: "Email is successfully verified, account activated",
            });
        } catch (e) {
            next(e);
        }
    }

    public async verifyRequest(
        req: Request,
        res: Response<IApiSuccessResponse<{ verifyToken: string }>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const user = await authService.verifyRequest(id);
            res.status(StatusCodeEnums.OK).json({
                data: user,
                details:
                    "New verify token is created successfully. Check your email!",
            });
        } catch (e) {
            next(e);
        }
    }

    public async recoveryPasswordRequest(
        req: Request,
        res: Response<IApiSuccessResponse<void | null>>,
        next: NextFunction,
    ) {
        try {
            const { email } = req.body;
            const user = await userService.getByEmail(email);
            if (user) {
                await authService.recoveryPasswordRequest(user);
            }
            res.status(StatusCodeEnums.OK).json({
                data: null,
                details: "Check your email",
            });
        } catch (e) {
            next(e);
        }
    }

    public async recoveryPassword(
        req: Request,
        res: Response<IApiSuccessResponse<IUser>>,
        next: NextFunction,
    ) {
        try {
            const { token } = req.params as { token: string };
            const { password } = req.body;
            const user = await authService.recoveryPassword(token, password);
            res.status(StatusCodeEnums.OK).json({
                data: user,
                details: "Password successfully changed",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
