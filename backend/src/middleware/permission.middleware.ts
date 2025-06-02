import { NextFunction, Request, Response } from "express";

import { RoleEnums } from "../enums/role.enums";
import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/tokens.interface";

class PermissionMiddleware {
    public checkRole(roles: RoleEnums[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const tokenPayload = req.res.locals
                    .tokenPayload as ITokenPayload;

                const { role } = tokenPayload;

                if (!roles.includes(role)) {
                    throw new ApiError(
                        StatusCodeEnums.BAD_REQUEST,
                        "Insufficient rights",
                    );
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const permissionMiddleware = new PermissionMiddleware();
