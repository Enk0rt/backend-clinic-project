import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";
import { Clinic } from "./clinic.model";

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

function flattenUserInfo<
    T extends { userInfo?: Record<string, any>; _id?: string },
>(doc: unknown, ret: T): T {
    if (ret.userInfo && typeof ret.userInfo === "object") {
        Object.assign(ret, ret.userInfo);
        delete ret.userInfo;
        delete ret._id;
    }
    return ret;
}

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
    return flattenUserInfo(doc, ret);
}

doctorSchema.post("save", async function (doc: IDoctor, next) {
    const clinics = doc;

    if (Array.isArray(clinics) && clinics.length > 0) {
        await Promise.all(
            clinics.map(async (clinicId: any) => {
                await Clinic.findByIdAndUpdate(
                    clinicId,
                    { $addToSet: { doctors: doc._id } },
                    { new: true },
                );
            }),
        );
    }

    next();
});

export const Doctor = model<IDoctor>("doctor", doctorSchema);
