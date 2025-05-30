import * as jwt from "jsonwebtoken";

import { config } from "../configs/config";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { StatusCodeEnums } from "../enums/status-code.enums";
import { TokenTypeEnums } from "../enums/token-type.enums";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/tokens.interface";

class TokenService {
    public generateTokens(payload: ITokenPayload): ITokenPair {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_LIFETIME,
        });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
            expiresIn: config.JWT_REFRESH_LIFETIME,
        });

        return { accessToken, refreshToken };
    }

    public generateActionToken(
        payload: ITokenPayload,
        type: ActionTokenTypeEnum,
    ): string {
        let secret: string;
        let expiresIn: any;

        switch (type) {
            case ActionTokenTypeEnum.ACTIVATE:
                secret = config.JWT_ACTIVATE_SECRET;
                expiresIn = config.JWT_ACTIVATE_LIFETIME;
                break;
            case ActionTokenTypeEnum.RECOVERY:
                secret = config.JWT_RECOVERY_SECRET;
                expiresIn = config.JWT_RECOVERY_LIFETIME;
                break;
            default:
                throw new ApiError(
                    StatusCodeEnums.BAD_REQUEST,
                    "Invalid action token type",
                );
        }
        return jwt.sign(payload, secret, { expiresIn });
    }

    public verifyToken(
        token: string,
        type: TokenTypeEnums | ActionTokenTypeEnum,
    ): ITokenPayload {
        try {
            let secret: string;

            switch (type) {
                case ActionTokenTypeEnum.ACTIVATE:
                    secret = config.JWT_ACTIVATE_SECRET;
                    break;
                case ActionTokenTypeEnum.RECOVERY:
                    secret = config.JWT_RECOVERY_SECRET;
                    break;
                case TokenTypeEnums.ACCESS_TOKEN:
                    secret = config.JWT_ACCESS_SECRET;
                    break;
                case TokenTypeEnums.REFRESH_TOKEN:
                    secret = config.JWT_REFRESH_SECRET;
                    break;
                default:
                    throw new ApiError(
                        StatusCodeEnums.BAD_REQUEST,
                        "Invalid token type",
                    );
            }
            return jwt.verify(token, secret) as ITokenPayload;
        } catch {
            throw new ApiError(StatusCodeEnums.UNAUTHORIZED, "Invalid token");
        }
    }
}

export const tokenService = new TokenService();
