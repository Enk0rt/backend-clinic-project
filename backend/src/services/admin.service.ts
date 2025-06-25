import { config } from "../configs/config";
import { emailConstants } from "../constants/email.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailEnums } from "../enums/email.enums";
import { RoleEnums } from "../enums/role.enums";
import {
    IDoctor,
    IDoctorCreateByAdminDTO,
} from "../interfaces/doctor.interface";
import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { adminRepository } from "../repositories/admin.repository";
import { doctorRepository } from "../repositories/doctor.repository";
import { doctorService } from "./doctor.service";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { syncRelationsService } from "./sync-relations.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AdminService {
    public async makeAdmin(id: string): Promise<IUser> {
        return await adminRepository.makeAdmin(id);
    }

    public async makeUser(id: string): Promise<IUser> {
        const doctor = await doctorService.getById(id);
        if (doctor) {
            await doctorRepository.delete(id);
        }
        return await adminRepository.makeUser(id);
    }

    public async makeDoctor(id: string, role: RoleEnums): Promise<IDoctor> {
        const user = await adminRepository.makeDoctor(id);

        if (role === RoleEnums.DOCTOR) {
            await doctorService.isDoctorExist(id);
        }
        await doctorService.create({
            _id: user._id,
            userInfo: user._id,
        });
        return await doctorService.getById(id);
    }

    public async createDoctorByAdmin(
        data: IDoctorCreateByAdminDTO,
    ): Promise<IDoctor> {
        await userService.isEmailUnique(data.email);
        const password = await passwordService.hashPass(data.password);
        const newUser = await User.create({
            ...data,
            password,
        });
        const verifyToken = tokenService.generateActionToken(
            {
                userId: newUser._id,
                role: newUser.role,
            },
            ActionTokenTypeEnum.ACTIVATE,
        );

        await emailService.sendMail(
            newUser.email,
            emailConstants[EmailEnums.ACTIVATE],
            {
                name: newUser.name,
                url: `${config.FRONTEND_URL}/api/auth/verify/${verifyToken}`,
            },
        );

        await doctorRepository.create({
            _id: newUser._id,
            userInfo: newUser._id,
            services: [],
            clinics: [],
        });

        const { clinicIds, serviceIds } =
            await syncRelationsService.syncServicesAndClinics(
                newUser._id,
                data.services,
                data.clinics,
            );

        await doctorRepository.updateById(newUser._id, {
            services: serviceIds,
            clinics: clinicIds,
        });

        return await doctorRepository.getById(newUser._id);
    }
}

export const adminService = new AdminService();
