import { ObjectId } from "mongodb";
import { FilterQuery, SortOrder } from "mongoose";

import {
    IService,
    IServiceQuery,
    IServiceResponse,
} from "../interfaces/service.interface";
import { Service } from "../models/service.model";

class DoctorServicesRepository {
    public async getAll(query: IServiceQuery): Promise<IServiceResponse> {
        const page = Number(query.page);
        const pageSize = Number(query.pageSize);
        const skip = pageSize * (page - 1);

        const filterObject: FilterQuery<IService> = {};

        if (query.search) {
            const regex = new RegExp(`.*${query.search}.*`, "i");
            filterObject.$or = [{ name: { $regex: regex } }];
        }

        const sortDirection: SortOrder =
            Number(query.sortDirection) === -1 || query.sortDirection === "desc"
                ? -1
                : 1;

        const [data, total] = await Promise.all([
            Service.find(filterObject)
                .limit(pageSize)
                .skip(skip)
                .sort({ [query.sort]: sortDirection })
                .populate({
                    path: "doctors",
                    select: "phoneNumber",
                    populate: {
                        path: "userInfo",
                        select: "name surname age phoneNumber",
                    },
                })
                .populate({ path: "clinics", select: "name city address" }),
            Service.find(filterObject).countDocuments(),
        ]);

        const totalPages = pageSize ? Math.ceil(total / pageSize) : undefined;

        return {
            data,
            total,
            ...(pageSize && { pageSize, page, totalPages }),
        };
    }

    public getById(id: string | ObjectId): Promise<IService> {
        return Service.findById(id)
            .populate({
                path: "doctors",
                select: "phoneNumber",
                populate: {
                    path: "userInfo",
                    select: "name surname age phoneNumber",
                },
            })
            .populate({ path: "clinics", select: "name city address" });
    }

    public getByName(name: string): Promise<IService> {
        return Service.findOne({ name });
    }

    public create(data: Partial<IService>): Promise<IService> {
        return Service.create(data);
    }

    public updateById(
        id: string | ObjectId,
        data: Partial<IService>,
    ): Promise<IService> {
        return Service.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        })
            .populate({
                path: "doctors",
                select: "phoneNumber",
                populate: {
                    path: "userInfo",
                    select: "name surname age phoneNumber",
                },
            })
            .populate({ path: "clinics", select: "name city address" });
    }

    public delete(id: string): Promise<void> {
        return Service.findByIdAndDelete(id);
    }
}

export const doctorServicesRepository = new DoctorServicesRepository();
