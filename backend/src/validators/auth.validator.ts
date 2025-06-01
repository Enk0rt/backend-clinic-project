import { RegexEnums } from "../enums/regex.enums";
import { zod } from "../zod";

export class AuthValidator {
    private static refresh = zod.string().trim();
    private static email = zod.string().regex(new RegExp(RegexEnums.EMAIL), {
        message: "Email does not match required pattern",
    });
    private static password = zod
        .string()
        .regex(new RegExp(RegexEnums.PASSWORD), {
            message: "Password does not match required pattern",
        });

    public static signIn = zod.object({
        email: zod
            .string()
            .nonempty("Email is required")
            .regex(new RegExp(RegexEnums.EMAIL), "Invalid email format")
            .trim(),
        password: zod
            .string()
            .nonempty("Password is required")
            .regex(new RegExp(RegexEnums.PASSWORD), "Invalid password format"),
    });

    public static refreshToken = zod.object({
        refreshToken: this.refresh,
    });

    public static validateEmail = zod.object({
        email: this.email,
    });

    public static validatePassword = zod.object({
        password: this.password,
    });
}
