import { RegexEnums } from "../enums/regex.enums";
import { zod } from "../zod";

export class DoctorValidator {
    public static createDoctor = zod.object({
        name: zod
            .string({ required_error: "Name is required" })
            .nonempty("Name is required")
            .regex(new RegExp(RegexEnums.NAME), "Invalid name format"),

        surname: zod
            .string({ required_error: "Surname is required" })
            .nonempty("Surname is required")
            .regex(new RegExp(RegexEnums.NAME), "Invalid surname format"),

        age: zod.preprocess((val) => {
            if (typeof val === "string") {
                const age = Number(val);
                return isNaN(age) ? val : age;
            }
            return val;
        }, zod.number().min(2, "Age must be more then 0").max(200, "Age must be less then 200").optional()),

        phoneNumber: zod
            .string({ required_error: "Phone number is required" })
            .nonempty("Phone number is required")
            .regex(
                new RegExp(RegexEnums.PHONE),
                "Invalid phone number  format",
            ),

        email: zod
            .string({ required_error: "Email is required" })
            .nonempty("Email is required")
            .email("Invalid email format")
            .trim(),

        password: zod
            .string({ required_error: "Password is required" })
            .nonempty("Password is required")
            .regex(new RegExp(RegexEnums.PASSWORD), "Invalid password format"),

        services: zod.preprocess(
            (val) => {
                if (typeof val === "string") return [val];
                return val;
            },
            zod
                .array(
                    zod.string({ required_error: "Servicnamnes is required" }),
                )
                .nonempty("At least one service is required"),
        ),

        clinics: zod.preprocess(
            (val) => {
                if (typeof val === "string") return [val];
                return val;
            },
            zod
                .array(zod.string({ required_error: "Clinics is required" }))
                .nonempty("At least one clinic is required"),
        ),
    });

    public static updateDoctor = zod.object({
        services: zod.preprocess((val) => {
            if (typeof val === "string") return [val];
            return val;
        }, zod.array(zod.string()).nonempty("At least one service is required")),

        clinics: zod.preprocess((val) => {
            if (typeof val === "string") return [val];
            return val;
        }, zod.array(zod.string()).nonempty("At least one clinic is required")),
    });
}
