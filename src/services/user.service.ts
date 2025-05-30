import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
    public async getAll(): Promise<IUser[]> {
        return await userRepository.getAll();
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
        if (!user) {
            throw new ApiError(StatusCodeEnums.NOT_FOUND, "User not found");
        }
        return await userRepository.deleteById(id);
    }
}

export const userService = new UserService();
