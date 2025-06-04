import * as mongoose from "mongoose";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IService } from "../interfaces/service.interface";
import { doctorServicesRepository } from "../repositories/doctor-services.repository";
import { checkServicesExistAndReturnId } from "../utils/check-services";

class DoctorServicesService {
    public async getAll(): Promise<IService[]> {
        return await doctorServicesRepository.getAll();
    }

    public async getById(id: string): Promise<IService> {
        const service = await doctorServicesRepository.getById(id);

        if (!service) {
            throw new ApiError(
                StatusCodeEnums.NOT_FOUND,
                "Service is not found",
            );
        }

        return service;
    }

    public async getByName(name: string): Promise<IService> {
        return await doctorServicesRepository.getByName(name);
    }
    public async getByNames(names: string[]): Promise<IService[]> {
        return await doctorServicesRepository.getByNames(names);
    }

    public async create(data: Partial<IService>): Promise<IService> {
        const isExist = await doctorServicesRepository.getByName(data.name);
        if (isExist) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "Service already exists",
            );
        }
        const newService = await doctorServicesRepository.create(data);
        return await doctorServicesRepository.getByName(newService.name);
    }

    public async updateById(id: string, data: IService): Promise<IService> {
        const service = await doctorServicesRepository.updateById(id, data);

        if (!service) {
            throw new ApiError(
                StatusCodeEnums.NOT_FOUND,
                "Service is not found",
            );
        }

        return await doctorServicesRepository.getById(id);
    }

    public async delete(id: string): Promise<void> {
        return await doctorServicesRepository.delete(id);
    }

    public async checkServicesExist(
        names: string[] | string,
    ): Promise<mongoose.Types.ObjectId[]> {
        const { servicesId } = await checkServicesExistAndReturnId(names);
        return servicesId;
    }
}

export const doctorServicesService = new DoctorServicesService();
