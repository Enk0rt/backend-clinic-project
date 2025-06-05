import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IUser, IUserQuery, IUserResponse } from "../interfaces/user.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { userRepository } from "../repositories/user.repository";

class UserService {
    public async getAll(query: IUserQuery): Promise<IUserResponse> {
        const allowedSortFields = [
            "name",
            "surname",
            "age",
            "email",
            "createdAt",
        ];

        if (query.sort && !allowedSortFields.includes(query.sort)) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "Invalid sort value",
            );
        }

        return await userRepository.getAll(query);
    }

    public async getById(id: string): Promise<IUser> {
        const user = await userRepository.getById(id);
        if (!user) {
            throw new ApiError(StatusCodeEnums.NOT_FOUND, "User not found");
        }
        return user;
    }

    public async getByEmail(email: string): Promise<IUser> {
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ApiError(StatusCodeEnums.NOT_FOUND, "User not found");
        }
        return user;
    }

    public async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
        const user = await userRepository.updateById(id, data);
        if (!user) {
            throw new ApiError(StatusCodeEnums.NOT_FOUND, "User not found");
        }
        return await userRepository.getById(id);
    }

    public async delete(id: string): Promise<void> {
        const user = await userRepository.getById(id);
        const doctor = await doctorRepository.getById(id);
        if (doctor) {
            await doctorRepository.delete(id);
        }
        if (!user) {
            throw new ApiError(StatusCodeEnums.NOT_FOUND, "User not found");
        }
        return await userRepository.deleteById(id);
    }

    public async isEmailUnique(email: string): Promise<void> {
        const user = await userRepository.getByEmail(email);
        if (user) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "User already exists",
            );
        }
    }
}

export const userService = new UserService();
