import { model, Schema } from "mongoose";

import { RoleEnums } from "../enums/role.enums";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
    {
        name: { type: String, required: false },
        surname: { type: String, required: false },
        age: { type: Number, required: false },
        email: { type: String, required: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        role: {
            enum: RoleEnums,
            type: String,
            required: true,
            default: RoleEnums.USER,
        },
        isActive: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    },
);

export const User = model<IUser>("user", userSchema);
