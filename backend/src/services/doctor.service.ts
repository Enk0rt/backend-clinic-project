import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { userRepository } from "../repositories/user.repository";
import { adminService } from "./admin.service";

class DoctorService {
    public async getAll(): Promise<IDoctor[]> {
        return await doctorRepository.getAll();
    }

    public async getById(id: string): Promise<IDoctor> {
        return await doctorRepository.getById(id);
    }

    public async update(
        id: string,
        data: Partial<IDoctorDTO>,
    ): Promise<IDoctorDTO> {
        return await doctorRepository.updateById(id, data);
    }

    public async create(data: Partial<IDoctor>): Promise<IDoctor> {
        return await doctorRepository.create(data);
    }

    public async delete(id: string) {
        await adminService.makeUser(id);
    }
    public async isEmailUnique(email: string): Promise<void> {
        const doctor = await userRepository.getByEmail(email);
        if (doctor) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "Doctor already exists",
            );
        }
    }
}

export const doctorService = new DoctorService();
