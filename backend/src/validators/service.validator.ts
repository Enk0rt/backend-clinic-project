import { RegexEnums } from "../enums/regex.enums";
import { zod } from "../zod";

export class ServiceValidator {
    public static createOrUpdate = zod.object({
        name: zod
            .string({ required_error: "Name is required" })
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters")
            .regex(new RegExp(RegexEnums.SERVICE_NAME), "Invalid name format")
            .nonempty("Name is required"),
    });
}
