import { model, Schema } from "mongoose";

import { IClinic } from "../interfaces/clinic.interface";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
        city: { type: String },
        address: { type: String },
        doctors: [{ type: Schema.Types.ObjectId, ref: "doctor" }],
        services: [{ type: Schema.Types.ObjectId, ref: "services" }],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Clinic = model<IClinic>("clinic", clinicSchema);
