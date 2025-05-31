import { config } from "../configs/config";
import { emailConstants } from "../constants/email.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailEnums } from "../enums/email.enums";
import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPair } from "../interfaces/tokens.interface";
import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
    public async signUp(
        data: IUserCreateDTO,
    ): Promise<{ user: IUser; verifyToken: string }> {
        await userService.isEmailUnique(data.email);
        const password = await passwordService.hashPass(data.password);
        const newUser = await userRepository.create({ ...data, password });

        const token = tokenService.generateActionToken(
            {
                userId: newUser._id,
                role: newUser.role,
            },
            ActionTokenTypeEnum.ACTIVATE,
        );

        await emailService.sendMail(
            newUser.email,
            emailConstants[EmailEnums.ACTIVATE],
            {
                name: newUser.name,
                url: `${config.FRONTEND_URL}/auth/verify/${token}`,
            },
        );
        return { user: newUser, verifyToken: token };
    }

    public async signIn({
        email,
        password,
    }: IAuth): Promise<{ user: IUser; tokens: ITokenPair }> {
        const user = await userService.getByEmail(email);
        if (!user) {
            throw new ApiError(
                StatusCodeEnums.UNAUTHORIZED,
                "Invalid email or password",
            );
        }
        const isValidPass = await passwordService.comparePass(
            password,
            user.password,
        );

        if (!user.isActive) {
            throw new ApiError(
                StatusCodeEnums.FORBIDDEN,
                "Account is not active",
            );
        }

        if (!isValidPass) {
            throw new ApiError(
                StatusCodeEnums.UNAUTHORIZED,
                "Invalid email or password",
            );
        }

        const tokens = tokenService.generateTokens({
            userId: user._id,
            role: user.role,
        });
        await tokenRepository.create({ ...tokens, _userId: user._id });
        return {
            user,
            tokens,
        };
    }

    public async activate(token: string): Promise<IUser> {
        const { userId } = tokenService.verifyToken(
            token,
            ActionTokenTypeEnum.ACTIVATE,
        );

        const user = await userService.updateUser(userId, {
            isActive: true,
            isVerified: true,
        });

        await emailService.sendMail(
            user.email,
            emailConstants[EmailEnums.WELCOME],
            { name: user.name },
        );
        return user;
    }
}

export const authService = new AuthService();
