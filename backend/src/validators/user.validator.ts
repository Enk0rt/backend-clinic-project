import { RegexEnums } from "../enums/regex.enums";
import { zod } from "../zod";

export class UserValidator {
    public static createUser = zod.object({
        email: zod
            .string({ required_error: "Email is required" })
            .email("Invalid email format")
            .trim()
            .nonempty("Email is required"),
        password: zod
            .string({ required_error: "Password is required" })
            .regex(new RegExp(RegexEnums.PASSWORD), "Invalid password format")
            .nonempty("Password is required"),
        name: zod
            .string({ required_error: "Name is required" })
            .regex(new RegExp(RegexEnums.NAME), "Invalid name format")
            .nonempty("Name is required"),
        surname: zod
            .string({ required_error: "Name is required" })
            .regex(new RegExp(RegexEnums.NAME), "Invalid surname format")
            .nonempty("Surname is required"),
        age: zod.preprocess((val) => {
            if (typeof val === "string") {
                const parsed = Number(val);
                return isNaN(parsed) ? val : parsed;
            }
            return val;
        }, zod.number().min(2, "Age must be more then 0").max(100, "Age must be less then 200").optional()),
        phoneNumber: zod
            .string({ required_error: "Phone number is required" })
            .regex(new RegExp(RegexEnums.PHONE), "Invalid phone number  format")
            .nonempty("Phone number is required"),
    });

    public static updateUser = zod.object({
        name: zod
            .string()
            .regex(new RegExp(RegexEnums.NAME), "Invalid name format")
            .optional(),
        surname: zod
            .string()
            .regex(new RegExp(RegexEnums.NAME), "Invalid surname format")
            .optional(),
        age: zod.preprocess((val) => {
            if (typeof val === "string") {
                const parsed = Number(val);
                return isNaN(parsed) ? val : parsed;
            }
            return val;
        }, zod.number().min(2, "Age must be more then 0").max(100, "Age must be less then 200").optional()),
        phoneNumber: zod
            .string()
            .regex(new RegExp(RegexEnums.PHONE), "Invalid phone number  format")
            .optional(),
    });
}
