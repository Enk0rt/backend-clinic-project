import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema(
    {
        userInfo: { type: Schema.Types.ObjectId, ref: "user" },
        phoneNumber: { type: String, default: null },
        services: [{ type: Schema.Types.ObjectId, ref: "service" }],
        clinics: [{ type: Schema.Types.ObjectId, ref: "clinic" }],
    },
    {
        timestamps: true,
        versionKey: false,
        toObject: { virtuals: true, transform: transformDoctor },
        toJSON: { virtuals: true, transform: transformDoctor },
    },
);

function transformDoctor(doc: any, ret: any) {
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
