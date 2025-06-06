import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import {
    IService,
    IServiceQuery,
    IServiceResponse,
} from "../interfaces/service.interface";
import { Doctor } from "../models/doctor.model";
import { Service } from "../models/service.model";
import { doctorServicesRepository } from "../repositories/doctor-services.repository";

class DoctorServicesService {
    public async getAll(query: IServiceQuery): Promise<IServiceResponse> {
        const allowedSortNames = ["name"];

        if (query.sort && !allowedSortNames.includes(query.sort)) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "Invalid sort value",
            );
        }

        return await doctorServicesRepository.getAll(query);
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

    public async checkServiceOrCreate(serviceName: string): Promise<ObjectId> {
        let service = await this.getByName(serviceName);
        if (!service) {
            service = await doctorServicesRepository.create({
                name: serviceName,
                doctors: [],
                clinics: [],
            });
        }
        return new mongoose.Types.ObjectId(service._id);
    }

    public async syncServiceRelations(serviceId: ObjectId) {
        const doctors = await Doctor.find({ services: serviceId });

        const doctorIds = new Set<string>();
        const clinicIds = new Set<string>();

        for (const doctor of doctors) {
            doctorIds.add(doctor._id.toString());
            for (const clinicId of doctor.clinics) {
                clinicIds.add(clinicId.toString());
            }
        }

        await Service.updateOne(
            { _id: serviceId },
            {
                $set: {
                    doctors: Array.from(doctorIds).map(
                        (id) => new ObjectId(id),
                    ),
                    clinics: Array.from(clinicIds).map(
                        (id) => new ObjectId(id),
                    ),
                },
            },
        );
    }
}

export const doctorServicesService = new DoctorServicesService();
