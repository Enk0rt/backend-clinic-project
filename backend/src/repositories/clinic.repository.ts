import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public getAll(): Promise<IClinic[]> {
        return Clinic.find().populate("doctors");
    }

    public getById(id: string): Promise<IClinic> {
        return Clinic.findById(id).populate("doctors");
    }

    public getByNames(names: string[]): Promise<IClinic[]> {
        const regexes = names.map((name) => new RegExp(`^${name}$`, "i"));
        return Clinic.find({ name: { $in: regexes } })
            .populate("services")
            .populate("doctors");
    }

    public create(data: IClinicDTO): Promise<IClinic> {
        return Clinic.create(data);
    }

    public updateById(id: string, data: Partial<IClinic>): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        })
            .populate("services")
            .populate("doctors");
    }

    public async delete(id: string): Promise<void> {
        Clinic.findByIdAndDelete(id);
    }
}

export const clinicRepository = new ClinicRepository();
