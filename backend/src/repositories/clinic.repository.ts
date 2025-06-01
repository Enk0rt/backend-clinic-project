import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAll(): Promise<IClinic[]> {
        return Clinic.find();
    }

    public getById(id: string): Promise<IClinic> {
        return Clinic.findById(id);
    }

    public getByName(name: string): Promise<IClinic> {
        return Clinic.findOne({ name });
    }

    public create(data: IClinicDTO): Promise<IClinic> {
        return Clinic.create(data);
    }

    public updateById(id: string, data: Partial<IClinic>): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(id, { ...data, updatedAt: Date.now() });
    }

    public async delete(id: string): Promise<void> {
        Clinic.findByIdAndDelete(id);
    }
}

export const clinicRepository = new ClinicRepository();
