import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public getAll(): Promise<IDoctor[]> {
        return Doctor.find().populate("userInfo").populate("services");
    }

    public getById(id: string): Promise<IDoctor> {
        return Doctor.findById(id).populate("userInfo").populate("services");
    }

    public updateById(id: string, data: Partial<IDoctorDTO>): Promise<IDoctor> {
        return Doctor.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        })
            .populate("userInfo")
            .populate("services");
    }

    public create(data: Partial<IDoctor>): Promise<IDoctor> {
        return Doctor.create(data);
    }

    public delete(id: string): Promise<void> {
        return Doctor.findByIdAndDelete(id);
    }
}

export const doctorRepository = new DoctorRepository();
