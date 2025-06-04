import mongoose from "mongoose";

import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAll(): Promise<IClinic[]> {
        return Clinic.find()
            .populate({
                path: "doctors",
                select: "phoneNumber id",
                populate: { path: "userInfo", select: "name surname age" },
            })
            .populate({ path: "services", select: "name" });
    }

    public getById(id: string): Promise<IClinic> {
        return Clinic.findById(id)
            .populate({
                path: "doctors",
                select: "phoneNumber, id",
                populate: { path: "userInfo", select: "name,surname,age" },
            })
            .populate({ path: "services", select: "name" });
    }

    public getByNames(names: string[]): Promise<IClinic[]> {
        const regexes = names.map((name) => new RegExp(`^${name}$`, "i"));
        return Clinic.find({ name: { $in: regexes } });
    }

    public getByName(name: string): Promise<IClinic> {
        return Clinic.findOne({ name });
    }

    public create(data: Partial<IClinicDTO>): Promise<IClinic> {
        return Clinic.create(data);
    }

    public updateById(id: string, data: Partial<IClinic>): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(
            data._id,
            { $addToSet: { doctors: new mongoose.Types.ObjectId(id) } },
            { new: true },
        )
            .populate({
                path: "doctors",
                select: "phoneNumber, id",
                populate: { path: "userInfo", select: "name,surname,age" },
            })
            .populate({ path: "services", select: "name" });
    }

    public delete(id: string): Promise<void> {
        return Clinic.findByIdAndDelete(id);
    }
}

export const clinicRepository = new ClinicRepository();
