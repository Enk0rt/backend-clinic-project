import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IDoctor, IDoctorUpdateDTO } from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { adminService } from "./admin.service";
import { clinicService } from "./clinic.service";
import { doctorServicesService } from "./doctor-services.service";

class DoctorService {
    public async getAll(): Promise<IDoctor[]> {
        return await doctorRepository.getAll();
    }

    public async getById(id: string): Promise<IDoctor> {
        return await doctorRepository.getById(id);
    }

    public async update(
        id: string,
        data: Partial<IDoctorUpdateDTO>,
    ): Promise<IDoctor> {
        const servicesId = await doctorServicesService.checkServicesExist(
            data.services,
        );
        const clinicsId = await clinicService.checkClinicsExist(data.clinics);

        const updatedDoctor = await doctorRepository.updateById(id, {
            ...data,
            ...(servicesId && { services: servicesId }),
            ...(clinicsId && { clinics: clinicsId }),
        });

        if (!updatedDoctor) {
            throw new ApiError(StatusCodeEnums.NOT_FOUND, "Doctor not found");
        }

        return await doctorService.getById(id);
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
