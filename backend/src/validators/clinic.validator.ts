import { RegexEnums } from "../enums/regex.enums";
import { zod } from "../zod";

export class ClinicValidator {
    public static createOrUpdate = zod.object({
        name: zod
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters")
            .regex(new RegExp(RegexEnums.CLINIC_NAME), "Invalid name format")
            .nonempty("Name is required"),

        city: zod
            .string()
            .min(2, "City must be at least 2 characters")
            .max(100, "City must be at most 100 characters")
            .regex(new RegExp(RegexEnums.CITY), "Invalid city name format")
            .nonempty("City is required"),

        address: zod
            .string()
            .min(5, "Address must be at least 5 characters")
            .max(200, "Address must be at most 200 characters")
            .regex(new RegExp(RegexEnums.ADDRESS), "Invalid address format")
            .nonempty("Address is required"),
    });
}
