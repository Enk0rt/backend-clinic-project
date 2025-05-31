import { model, Schema } from "mongoose";

import { IService } from "../interfaces/service.interface";

const serviceSchema = new Schema(
    {
        name: { type: String },
        doctors: { ref: "doctor" },
        clinics: { type: [String], ref: "clinic" },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const Service = model<IService>("service", serviceSchema);
