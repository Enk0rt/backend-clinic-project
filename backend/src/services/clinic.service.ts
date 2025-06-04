import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";
import { Doctor } from "../models/doctor.model";
import { clinicRepository } from "../repositories/clinic.repository";

class ClinicService {
    public async getAll(): Promise<IClinic[]> {
        return await clinicRepository.getAll();
    }

    public async getById(id: string): Promise<IClinic> {
        const clinic = await clinicRepository.getById(id);

        if (!clinic) {
            throw new ApiError(
                StatusCodeEnums.NOT_FOUND,
                "Clinic is not found",
            );
        }

        return clinic;
    }

    public async getByNames(names: string[]): Promise<IClinic[]> {
        const clinic = await clinicRepository.getByNames(names);

        if (!clinic) {
            throw new ApiError(
                StatusCodeEnums.NOT_FOUND,
                "Clinic is not found",
            );
        }
        return clinic;
    }

    public async getByName(name: string): Promise<IClinic> {
        const clinic = await clinicRepository.getByName(name);

        if (!clinic) {
            throw new ApiError(
                StatusCodeEnums.NOT_FOUND,
                "Clinic is not found",
            );
        }
        return clinic;
    }

    public async create(data: Partial<IClinicDTO>): Promise<IClinic> {
        const isExist = await clinicRepository.getByName(data.name);
        if (isExist) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "Clinic already exists",
            );
        }
        const newClinic = await clinicRepository.create(data);
        return await clinicRepository.getByName(newClinic.name);
    }

    public async updateById(
        id: string,
        data: Partial<IClinic>,
    ): Promise<IClinic> {
        const clinic = await clinicRepository.updateById(id, data);

        if (!clinic) {
            throw new ApiError(
                StatusCodeEnums.NOT_FOUND,
                "Clinic is not found",
            );
        }

        return await clinicRepository.getById(id);
    }

    public async delete(id: string): Promise<void> {
        await clinicRepository.delete(id);
    }

    public async checkClinicOrCreate(clinicName: string): Promise<ObjectId> {
        let clinic = await clinicRepository.getByName(clinicName);
        if (!clinic) {
            clinic = await this.create({
                name: clinicName,
                doctors: [],
                services: [],
            });
        }
        return new mongoose.Types.ObjectId(clinic._id);
    }

    public async syncClinicRelations(clinicId: ObjectId) {
        const doctors = await Doctor.find({ clinics: clinicId });
        const doctorIds = new Set<string>();
        const serviceIdsSet = new Set<string>();

        for (const doctor of doctors) {
            doctorIds.add(doctor._id.toString());

            for (const serviceId of doctor.services) {
                serviceIdsSet.add(serviceId.toString());
            }
        }

        await Clinic.updateOne(
            { _id: clinicId },
            {
                $set: {
                    doctors: Array.from(doctorIds).map(
                        (id) => new ObjectId(id),
                    ),
                    services: Array.from(serviceIdsSet).map(
                        (id) => new ObjectId(id),
                    ),
                },
            },
        );
    }
}

export const clinicService = new ClinicService();
