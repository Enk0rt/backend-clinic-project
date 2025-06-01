import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";

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

    public async create(data: {
        _id: string;
        userInfo: string;
        phoneNumber: null;
        clinics: null;
        services: null;
    }): Promise<IDoctor> {
        return await doctorRepository.create(data);
    }

    public async delete(id: string) {
        await doctorRepository.delete(id);
    }
}

export const doctorService = new DoctorService();
