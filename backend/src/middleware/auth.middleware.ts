import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { TokenTypeEnums } from "../enums/token-type.enums";
import { ApiError } from "../errors/api.error";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
    public async checkAccessToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader) {
                throw new ApiError(
                    StatusCodeEnums.UNAUTHORIZED,
                    "No token provided",
                );
            }

            const accessToken = authorizationHeader.split(" ")[1];

            const tokenPayload = tokenService.verifyToken(
                accessToken,
                TokenTypeEnums.ACCESS_TOKEN,
            );

            if (!accessToken) {
                throw new ApiError(
                    StatusCodeEnums.UNAUTHORIZED,
                    "No token provided",
                );
            }

            const isTokenExists = tokenService.isExists(
                accessToken,
                TokenTypeEnums.ACCESS_TOKEN,
            );

            if (!isTokenExists) {
                throw new ApiError(StatusCodeEnums.FORBIDDEN, "Invalid token");
            }

            req.res.locals.tokenPayload = tokenPayload;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkRefreshToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw new ApiError(
                    StatusCodeEnums.FORBIDDEN,
                    "Refresh token is not provided",
                );
            }

            const tokenPayload = tokenService.verifyToken(
                refreshToken,
                TokenTypeEnums.REFRESH_TOKEN,
            );

            const isTokenExists = await tokenService.isExists(
                refreshToken,
                TokenTypeEnums.REFRESH_TOKEN,
            );

            if (!isTokenExists) {
                throw new ApiError(StatusCodeEnums.FORBIDDEN, "Invalid Token");
            }

            req.res.locals.tokenPayload = tokenPayload;
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const authMiddleware = new AuthMiddleware();
