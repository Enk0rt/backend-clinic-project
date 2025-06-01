import { RoleEnums } from "../enums/role.enums";
import { IDoctor } from "../interfaces/doctor.interface";
import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class AdminRepository {
    public makeAdmin(id: string): Promise<IUser> {
        return User.findByIdAndUpdate(
            id,
            { role: RoleEnums.ADMIN },
            { new: true },
        );
    }

    public makeUser(id: string): Promise<IUser> {
        return User.findByIdAndUpdate(
            id,
            { role: RoleEnums.USER },
            { new: true },
        );
    }

    public makeDoctor(id: string): Promise<IDoctor> {
        return User.findByIdAndUpdate(
            id,
            { role: RoleEnums.DOCTOR },
            { new: true },
        );
    }
}

export const adminRepository = new AdminRepository();
