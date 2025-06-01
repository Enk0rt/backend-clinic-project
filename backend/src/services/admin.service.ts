import { RoleEnums } from "../enums/role.enums";
import { IDoctor } from "../interfaces/doctor.interface";
import { IUser } from "../interfaces/user.interface";
import { adminRepository } from "../repositories/admin.repository";
import { doctorService } from "./doctor.service";

class AdminService {
    // public async changeRole(
    //     id: string,
    //     role: RoleEnums,
    // ): Promise<IDoctor | IUser> {
    //     const user = await adminRepository.changeRole(id, role);
    //     if (!user) {
    //         throw new ApiError(StatusCodeEnums.NOT_FOUND, "User is not found");
    //     }
    //
    //     if (
    //         role !== RoleEnums.DOCTOR &&
    //         role !== RoleEnums.ADMIN &&
    //         role !== RoleEnums.USER
    //     ) {
    //         throw new ApiError(StatusCodeEnums.NOT_FOUND, "Role doesn't exist");
    //     }
    //
    //     if (role === RoleEnums.DOCTOR) {
    //         const exists = await doctorService.getById(user._id);
    //         if (!exists) {
    //             return await doctorService.create({
    //                 _id: user._id,
    //                 userInfo: user._id,
    //                 phoneNumber: null,
    //                 services: null,
    //                 clinics: null,
    //             });
    //         }
    //     }
    //     return user;
    // }

    public async makeAdmin(id: string): Promise<IUser> {
        return await adminRepository.makeAdmin(id);
    }

    public async makeUser(id: string): Promise<IUser> {
        return await adminRepository.makeUser(id);
    }

    public async makeDoctor(id: string, role: RoleEnums): Promise<IDoctor> {
        const user = await adminRepository.makeDoctor(id);

        if (role === RoleEnums.DOCTOR) {
            const exists = await doctorService.getById(user._id);
            if (!exists) {
                await doctorService.create({
                    _id: user._id,
                    userInfo: user._id,
                    phoneNumber: null,
                    services: null,
                    clinics: null,
                });
            }
            return user;
        }
    }
}

export const adminService = new AdminService();
