import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public getAll(): Promise<IUser[]> {
        return User.find();
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
