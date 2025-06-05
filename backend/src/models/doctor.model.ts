import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema(
    {
        userInfo: { type: Schema.Types.ObjectId, ref: "user" },
        services: [{ type: Schema.Types.ObjectId, ref: "service" }],
        clinics: [{ type: Schema.Types.ObjectId, ref: "clinic" }],
    },
    {
        timestamps: true,
        versionKey: false,
        toObject: { virtuals: false, transform: transformDoctor },
        toJSON: { virtuals: false, transform: transformDoctor },
    },
);

function transformDoctor(doc: any, ret: any) {
    if (ret.userInfo && typeof ret.userInfo === "object") {
        const { name, surname, age, phoneNumber, email, createdAt, updatedAt } =
            ret.userInfo;
        ret.userInfo = {
            name,
            surname,
            age,
            phoneNumber,
            email,
            createdAt,
            updatedAt,
        };
    }

    if (ret.services && Array.isArray(ret.services)) {
        ret.services = ret.services.map((service: any) =>
            typeof service === "object" && service !== null
                ? service.name
                : service,
        );
    }

    if (ret.clinics && Array.isArray(ret.clinics)) {
        ret.clinics = ret.clinics.map((clinic: any) =>
            typeof clinic === "object" && clinic !== null
                ? {
                      name: clinic.name,
                      city: clinic.city,
                      address: clinic.address,
                  }
                : clinic,
        );
    }

    return ret;
}

export const Doctor = model<IDoctor>("doctor", doctorSchema);
