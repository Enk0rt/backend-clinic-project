import mongoose, { FilterQuery, SortOrder } from "mongoose";

import { aggregatePipelineConstants } from "../constants/aggregate-pipeline.constants";
import {
    IClinic,
    IClinicDTO,
    IClinicQuery,
    IClinicResponse,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public async getAll(query: IClinicQuery): Promise<IClinicResponse> {
        const pageSize = query.pageSize ? Number(query.pageSize) : undefined;
        const page = pageSize ? Number(query.page) || 1 : undefined;
        const skip = pageSize && page ? (page - 1) * pageSize : 0;

        const filterObject: FilterQuery<IClinic> = {};

        const regex = new RegExp(`.*${query.search}.*`, "i");
        if (query.search) {
            filterObject.$or = [
                { name: { $regex: regex } },
                { city: { $regex: regex } },
                { address: { $regex: regex } },
                { "services.name": { $regex: regex } },
                { "doctors.userInfo.name": { $regex: regex } },
            ];
        }

        const sortDirection: SortOrder =
            query.sortDirection === "desc" || Number(query.sortDirection) === -1
                ? -1
                : 1;

        const pipeline = aggregatePipelineConstants.clinicAggregatePipeline(
            query,
            filterObject,
            skip,
            pageSize,
            sortDirection,
        );

        const result: Array<{
            data: IClinic[];
            totalCount: { count: number }[];
        }> = await Clinic.aggregate(pipeline);
        const data = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;
        const totalPages = pageSize ? Math.ceil(total / pageSize) : undefined;
        return {
            data,
            total,
            ...(pageSize && { pageSize, page, totalPages }),
        };
    }

    public getById(id: string): Promise<IClinic> {
        return Clinic.findById(id)
            .populate({
                path: "doctors",
                select: "phoneNumber",
                populate: { path: "userInfo", select: "name surname age" },
            })
            .populate({ path: "services", select: "name" });
    }

    public getByName(name: string): Promise<IClinic> {
        return Clinic.findOne({ name });
    }

    public create(data: Partial<IClinicDTO>): Promise<IClinic> {
        return Clinic.create(data);
    }

    public updateById(id: string, data: Partial<IClinic>): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(
            id,
            {
                ...data,
                $addToSet: { doctors: new mongoose.Types.ObjectId(id) },
            },
            { new: true },
        )
            .populate({
                path: "doctors",
                select: "phoneNumber",
                populate: { path: "userInfo", select: "name surname age" },
            })
            .populate({ path: "services", select: "name" });
    }

    public delete(id: string): Promise<void> {
        return Clinic.findByIdAndDelete(id);
    }
}

export const clinicRepository = new ClinicRepository();
