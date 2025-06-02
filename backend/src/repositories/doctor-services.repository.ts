import { IService } from "../interfaces/service.interface";
import { Service } from "../models/service.model";

class DoctorServicesRepository {
    public getAll(): Promise<IService[]> {
        return Service.find().populate("doctors").populate("clinics");
    }

    public getById(id: string): Promise<IService> {
        return Service.findById(id).populate("doctors").populate("clinics");
    }

    public getByNames(names: string[]): Promise<IService[]> {
        const regexes = names.map((name) => new RegExp(`^${name}$`, "i"));
        return Service.find({ name: { $in: regexes } })
            .populate("doctors")
            .populate("clinics");
    }

    public create(data: IService): Promise<IService> {
        return Service.create(data);
    }

    public updateById(id: string, data: Partial<IService>): Promise<IService> {
        return Service.findByIdAndUpdate(id, {
            ...data,
            updatedAt: Date.now(),
        })
            .populate("doctors")
            .populate("clinics");
    }

    public delete(id: string): Promise<void> {
        return Service.findByIdAndDelete(id);
    }
}

export const doctorServicesRepository = new DoctorServicesRepository();
