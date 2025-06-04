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
        toObject: { virtuals: false, transform: transformDoctor },
        toJSON: { virtuals: false, transform: transformDoctor },
    },
);

function transformDoctor(doc: any, ret: any) {
    if (ret.userInfo && typeof ret.userInfo === "object") {
        delete ret.userInfo._id;
    }

    if (Array.isArray(ret.services)) {
        ret.services = ret.services.map((service: any) =>
            service && typeof service === "object" && "name" in service
                ? service.name
                : service,
        );
    }

    if (Array.isArray(ret.clinics)) {
        ret.clinics = ret.clinics.map((clinic: any) =>
            clinic && typeof clinic === "object" && "name" in clinic
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
