import { model, Schema } from "mongoose";

import { IService } from "../interfaces/service.interface";

const serviceSchema = new Schema(
    {
        name: { type: String },
        doctors: { type: [Schema.Types.ObjectId], ref: "doctor", default: [] },
        clinics: { type: [Schema.Types.ObjectId], ref: "clinic", default: [] },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const Service = model<IService>("service", serviceSchema);
