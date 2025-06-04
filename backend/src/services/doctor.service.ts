import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IDoctor, IDoctorUpdateDTO } from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { adminService } from "./admin.service";
import { syncRelationsService } from "./sync-relations.service";

class DoctorService {
    public async getAll(): Promise<IDoctor[]> {
        return await doctorRepository.getAll();
    }

    public async getById(id: string): Promise<IDoctor> {
        return await doctorRepository.getById(id);
    }

    public async update(
        id: string,
        update: IDoctorUpdateDTO,
    ): Promise<IDoctor> {
        await syncRelationsService.syncServicesAndClinics(
            id,
            update.services,
            update.clinics,
        );

        await doctorRepository.updateById(id, {
            phoneNumber: update.phoneNumber,
        });
        return await doctorRepository.getById(id);
    }

    public async create(data: Partial<IDoctor>): Promise<IDoctor> {
        return await doctorRepository.create(data);
    }

    public async delete(id: string) {
        await adminService.makeUser(id);
    }

    public async isDoctorExist(id: string): Promise<void> {
        const doctor = await doctorRepository.getById(id);
        if (doctor) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "Doctor already exists",
            );
        }
    }
}

export const doctorService = new DoctorService();
