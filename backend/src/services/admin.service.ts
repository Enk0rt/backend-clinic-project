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
import { clinicService } from "./clinic.service";
import { doctorService } from "./doctor.service";
import { doctorServicesService } from "./doctor-services.service";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
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
            name: data.name,
            surname: data.surname,
            age: data.age,
            email: data.email,
            password,
            role: RoleEnums.DOCTOR,
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

        const servicesId = await doctorServicesService.checkServicesExist(
            data.services,
        );
        const clinicsId = await clinicService.checkClinicsExist(data.clinics);

        const doctor = await doctorRepository.create({
            _id: newUser._id,
            userInfo: newUser._id,
            phoneNumber: data.phoneNumber ?? null,
            services: servicesId,
            clinics: clinicsId,
        });

        return await doctorRepository.getById(doctor._id);
    }
}

export const adminService = new AdminService();
