import { FilterQuery, SortOrder } from "mongoose";

import {
    IUser,
    IUserCreateDTO,
    IUserQuery,
    IUserResponse,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public async getAll(query: IUserQuery): Promise<IUserResponse> {
        const page = Number(query.page) > 0 ? Number(query.page) : 1;
        const pageSize = Number(query.pageSize);
        const skip = query.pageSize * (query.page - 1);

        const filteredObject: FilterQuery<IUser> = { isDeleted: false };
        if (query.search) {
            const regex = new RegExp(`.*${query.search}.*`, "i");
            filteredObject.$or = [
                { name: { $regex: regex } },
                { surname: { $regex: regex } },
                { email: { $regex: regex } },
                { phoneNumber: { $regex: regex } },
            ];
        }
        const sortDirection: SortOrder =
            Number(query.sortDirection) === -1 || query.sortDirection === "desc"
                ? -1
                : 1;

        const [data, total] = await Promise.all([
            User.find(filteredObject)
                .limit(pageSize)
                .skip(skip)
                .sort({ [query.sort]: sortDirection }),
            User.find(filteredObject).countDocuments(),
        ]);

        const totalPages = pageSize
            ? Math.ceil(total / query.pageSize)
            : undefined;
        return {
            data,
            total,
            ...(pageSize && { pageSize, page, totalPages }),
        };
    }

    public getById(id: string): Promise<IUser> {
        return User.findById(id);
    }

    public getByEmail(email: string): Promise<IUser> {
        return User.findOne({ email });
    }

    public create(data: IUserCreateDTO): Promise<IUser> {
        return User.create(data);
    }

    public updateById(id: string, data: Partial<IUser>): Promise<IUser> {
        return User.findByIdAndUpdate(id, { ...data, updatedAt: Date.now() });
    }

    public deleteById(id: string): Promise<void> {
        return User.findByIdAndDelete(id);
    }
}

export const userRepository = new UserRepository();
