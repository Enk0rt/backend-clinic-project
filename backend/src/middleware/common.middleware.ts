import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";
import { ZodSchema } from "zod";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";

class CommonMiddleware {
    public isValidated(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params[key];
                if (!isObjectIdOrHexString(id)) {
                    throw new ApiError(400, `Invalid id [${key}]`);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }

    public validateBody(schema: ZodSchema<any>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                const messages = result.error.errors
                    .map((e) => e.message)
                    .join(", ");
                return next(
                    new ApiError(StatusCodeEnums.BAD_REQUEST, messages),
                );
            }

            req.body = result.data;
            next();
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
