import { RegexEnums } from "../enums/regex.enums";
import { zod } from "../zod";

export class UserValidator {
    public static create = zod.object({
        email: zod
            .string()
            .nonempty("Email is required")
            .email("Invalid email format")
            .trim(),
        password: zod
            .string()
            .nonempty("Password is required")
            .regex(new RegExp(RegexEnums.NAME), "Invalid password format"),
        name: zod
            .string()
            .nonempty("Name is required")
            .regex(new RegExp(RegexEnums.NAME), "Invalid name format"),
        surname: zod
            .string()
            .nonempty("Surname is required")
            .regex(new RegExp(RegexEnums.NAME), "Invalid surname format"),
        age: zod.preprocess((val) => {
            if (typeof val === "string") {
                const parsed = Number(val);
                return isNaN(parsed) ? val : parsed;
            }
            return val;
        }, zod.number().min(2, "Age must be more then 0").max(100, "Age must be less then 200").optional()),
    });

    public static update = zod.object({
        name: zod
            .string()
            .regex(new RegExp(RegexEnums.NAME), "Invalid name format"),
        surname: zod
            .string()
            .regex(new RegExp(RegexEnums.NAME), "Invalid surname format"),
        age: zod.preprocess((val) => {
            if (typeof val === "string") {
                const parsed = Number(val);
                return isNaN(parsed) ? val : parsed;
            }
            return val;
        }, zod.number().min(2, "Age must be more then 0").max(100, "Age must be less then 200").optional()),
    });
}
