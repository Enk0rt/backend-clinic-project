import mongoose, { FilterQuery } from "mongoose";

import {
    IClinic,
    IClinicDTO,
    IClinicQuery,
    IClinicResponse,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public async getAll(query: IClinicQuery): Promise<IClinicResponse> {
        const page = Number(query.page);
        const pageSize = Number(query.pageSize);
        const skip = pageSize * (page - 1);

        const filterObject: FilterQuery<IClinic> = {};

        if (query.search) {
            const regex = new RegExp(`.*${query.search}.*`, "i");
            filterObject.$or = [{ name: { $regex: regex } }];
        }

        const sortDirection =
            query.sortDirection === "desc" || Number(query.sortDirection) === -1
                ? -1
                : 1;

        const [clinics, total] = await Promise.all([
            Clinic.find(filterObject)
                .limit(pageSize)
                .skip(skip)
                .sort({ [query.sort]: sortDirection })
                .populate({
                    path: "doctors",
                    select: "phoneNumber id",
                    populate: { path: "userInfo", select: "name surname age" },
                })
                .populate({ path: "services", select: "name" }),
            Clinic.find(filterObject).countDocuments(),
        ]);
        const totalPages = Math.ceil(total / pageSize);
        return {
            data: clinics,
            total,
            ...(pageSize && { pageSize, page, totalPages }),
        };
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
