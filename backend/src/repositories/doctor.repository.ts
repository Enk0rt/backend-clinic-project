import { FilterQuery, SortOrder } from "mongoose";

import { aggregatePipelineConstants } from "../constants/aggregate-pipeline.constants";
import {
    IDoctor,
    IDoctorQuery,
    IDoctorResponse,
} from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";
import { escapeRegex } from "../utils/escapeRegex";

class DoctorRepository {
    public async getAll(query: IDoctorQuery): Promise<IDoctorResponse> {
        const pageSize = query.pageSize ? Number(query.pageSize) : undefined;
        const page = pageSize ? Number(query.page) || 1 : undefined;
        const skip = pageSize && page ? (page - 1) * pageSize : 0;

        const filterObject: FilterQuery<IDoctor> = {};

        if (["name", "surname", "age", "email"].includes(query.sort))
            query.sort = `userInfo.${query.sort}`;

        const sortDirection: SortOrder =
            query.sortDirection === "desc" || Number(query.sortDirection) === -1
                ? -1
                : 1;

        if (query.search) {
            const safeSearch = escapeRegex(query.search.trim()); // <- захищає від + і інших
            const regex = new RegExp(safeSearch, "i");
            filterObject.$or = [
                { "userInfo.name": { $regex: regex } },
                { "userInfo.surname": { $regex: regex } },
                { "userInfo.email": { $regex: regex } },
                { "userInfo.phoneNumber": { $regex: regex } },
            ];
        }

        const pipeline = aggregatePipelineConstants.doctorAggregatePipeline(
            query,
            filterObject,
            skip,
            pageSize,
            sortDirection,
        );

        const result: Array<{
            data: IDoctor[];
            totalCount: { count: number }[];
        }> = await Doctor.aggregate(pipeline);
        const data = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;
        const totalPages = pageSize ? Math.ceil(total / pageSize) : undefined;

        return {
            data,
            total,
            ...(pageSize && { pageSize, page, totalPages }),
        };
    }

    public getById(id: string): Promise<IDoctor> {
        return Doctor.findById(id)
            .populate({
                path: "userInfo",
                select: "name surname age email phoneNumber",
            })
            .populate({ path: "services", select: "_id name" })
            .populate({ path: "clinics", select: "_id name city address" });
    }

    public updateById(id: string, data: Partial<IDoctor>): Promise<IDoctor> {
        return Doctor.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        })
            .populate({
                path: "userInfo",
                select: "name surname age email honeNumber",
            })
            .populate({ path: "services", select: "_id name" })
            .populate({ path: "clinics", select: "_id name city address" });
    }

    public create(data: Partial<IDoctor>): Promise<IDoctor> {
        return Doctor.create(data);
    }

    public delete(id: string): Promise<void> {
        return Doctor.findByIdAndDelete(id);
    }
}

export const doctorRepository = new DoctorRepository();
