import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAll(): Promise<IClinic[]> {
        return Clinic.find();
    }

    public getById(id: string): Promise<IClinic> {
        return Clinic.findById(id);
    }

    public getByNames(names: string[]): Promise<IClinic[]> {
        const regexes = names.map((name) => new RegExp(`^${name}$`, "i"));
        return Clinic.find({ name: { $in: regexes } });
    }

    public create(data: IClinicDTO): Promise<IClinic> {
        return Clinic.create(data);
    }

    public updateById(id: string, data: Partial<IClinic>): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        });
    }

    public delete(id: string): Promise<void> {
        return Clinic.findByIdAndDelete(id);
    }
}

export const clinicRepository = new ClinicRepository();
