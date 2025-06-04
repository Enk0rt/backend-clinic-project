import { FilterQuery, SortOrder } from "mongoose";

import { IDoctor, IDoctorQuery } from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public async getAll(query: IDoctorQuery): Promise<{
        doctors: IDoctor[];
        total: number;
        pageSize?: number;
        page?: number;
        totalPages?: number;
    }> {
        const filter: FilterQuery<IDoctor> = {};

        if (query.search) {
            const regex = new RegExp(`.*${query.search}.*`, "i");
            filter.$or = [
                { "userInfo.name": { $regex: regex } },
                { "userInfo.surname": { $regex: regex } },
                { "userInfo.age": { $regex: regex } },
                { "userInfo.email": { $regex: regex } },
                { "userInfo.createdAt": { $regex: regex } },
                { phoneNumber: { $regex: regex } },
            ];
        }

        if (
            ["name", "surname", "age", "email", "createdAt"].includes(
                query.sort,
            )
        ) {
            query.sort = `userInfo.${query.sort}`;
        }
        const sortDirection: SortOrder =
            query.sortDirection === "desc" || Number(query.sortDirection) === -1
                ? -1
                : 1;

        const pageSize = query.pageSize ? Number(query.pageSize) : undefined;
        const page = pageSize ? Number(query.page) || 1 : undefined;
        const skip = pageSize && page ? (page - 1) * pageSize : 0;

        const pipeline: any[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "userInfo",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            { $unwind: "$userInfo" },
            {
                $lookup: {
                    from: "services",
                    localField: "services",
                    foreignField: "_id",
                    as: "services",
                },
            },
            {
                $lookup: {
                    from: "clinics",
                    localField: "clinics",
                    foreignField: "_id",
                    as: "clinics",
                },
            },
            { $match: filter },
            {
                $facet: {
                    data: [
                        { $sort: { [query.sort]: sortDirection } },
                        ...(pageSize
                            ? [{ $skip: skip }, { $limit: pageSize }]
                            : []),
                    ],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];

        const result = await Doctor.aggregate(pipeline);
        const doctors = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;
        const totalPages = pageSize ? Math.ceil(total / pageSize) : undefined;

        return {
            doctors,
            total,
            ...(pageSize && { pageSize, page, totalPages }),
        };
    }

    public getById(id: string): Promise<IDoctor> {
        return Doctor.findById(id)
            .populate("userInfo")
            .populate("services")
            .populate("clinics");
    }

    public updateById(id: string, data: Partial<IDoctor>): Promise<IDoctor> {
        return Doctor.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        })
            .populate("userInfo")
            .populate("services")
            .populate("clinics");
    }

    public create(data: Partial<IDoctor>): Promise<IDoctor> {
        return Doctor.create(data);
    }

    public delete(id: string): Promise<void> {
        return Doctor.findByIdAndDelete(id);
    }
}

export const doctorRepository = new DoctorRepository();
