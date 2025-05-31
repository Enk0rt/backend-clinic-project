import { model, Schema } from "mongoose";

import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        services: [String],
        clinics: { type: Schema.Types.ObjectId, ref: "clinic" },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Doctor = model<IDoctor>("doctor", doctorSchema);
