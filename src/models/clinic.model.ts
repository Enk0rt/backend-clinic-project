import { model, Schema } from "mongoose";

import { IClinic } from "../interfaces/clinic.interface";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
        city: { type: String, required: true },
        doctors: [{ type: Schema.Types.ObjectId, ref: "doctor" }],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Clinic = model<IClinic>("clinic", clinicSchema);
