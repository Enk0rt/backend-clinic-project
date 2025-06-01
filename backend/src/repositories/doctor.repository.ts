import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public getAll(): Promise<IDoctor[]> {
        return Doctor.find().populate("userInfo");
    }

    public getById(id: string): Promise<IDoctor> {
        return Doctor.findById(id).populate("userInfo");
    }

    public updateById(id: string, data: Partial<IDoctorDTO>): Promise<IDoctor> {
        return Doctor.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        }).populate("userInfo");
    }

    public create(data: {
        userInfo: string;
        phoneNumber: null;
        clinics: null;
        services: null;
    }): Promise<IDoctor> {
        return Doctor.create(data);
    }

    public delete(id: string): Promise<void> {
        return Doctor.findByIdAndDelete(id);
    }
}

export const doctorRepository = new DoctorRepository();
