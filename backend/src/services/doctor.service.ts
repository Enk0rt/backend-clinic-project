import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IDoctor, IDoctorUpdateDTO } from "../interfaces/doctor.interface";
import { Clinic } from "../models/clinic.model";
import { Doctor } from "../models/doctor.model";
import { Service } from "../models/service.model";
import { clinicRepository } from "../repositories/clinic.repository";
import { doctorRepository } from "../repositories/doctor.repository";
import { adminService } from "./admin.service";
import { clinicService } from "./clinic.service";
import { doctorServicesService } from "./doctor-services.service";

class DoctorService {
    public async getAll(): Promise<IDoctor[]> {
        return await doctorRepository.getAll();
    }

    public async getById(id: string): Promise<IDoctor> {
        return await doctorRepository.getById(id);
    }

    // public async update(
    //     id: string,
    //     data: Partial<IDoctorUpdateDTO>,
    // ): Promise<IDoctor> {
    //     const { servicesId } = await checkServicesExistAndReturnId(
    //         data.services,
    //     );
    //
    //     servicesId.map(
    //         async (serviceId) =>
    //             await doctorServicesService.updateById(serviceId, {
    //                 doctors: id,
    //             }),
    //     );
    //
    //     const { clinicsId } = await checkClinicsExistAndReturnId(data.clinics);
    //
    //     const updatedDoctor = await doctorRepository.updateById(id, {
    //         ...data,
    //         ...(servicesId && { services: servicesId }),
    //         ...(clinicsId && { clinics: clinicsId }),
    //     });
    //
    //     if (!updatedDoctor) {
    //         throw new ApiError(StatusCodeEnums.NOT_FOUND, "Doctor not found");
    //     }
    //
    //     return await doctorService.getById(id);
    // }

    public async update(
        id: string,
        update: IDoctorUpdateDTO,
    ): Promise<IDoctor> {
        const serviceNames = (
            Array.isArray(update.services)
                ? update.services
                : update.services.split(",")
        )
            .filter((service): service is string => typeof service === "string")
            .map((service) => service.trim().toLowerCase())
            .filter((service) => service.length > 0);
        const clinicNames = (
            Array.isArray(update.clinics)
                ? update.clinics
                : update.clinics.split(",")
        )
            .filter((service): service is string => typeof service === "string")
            .map((service) => service.trim().toLowerCase())
            .filter((service) => service.length > 0);
        for (const serviceName of serviceNames) {
            let service = await doctorServicesService.getByName(serviceName);
            if (!service) {
                service = await doctorServicesService.create({
                    name: serviceName,
                    doctors: [id],
                    clinics: [],
                });
            }
            const clinicIds: ObjectId[] = [];
            for (const name of clinicNames) {
                const foundClinic = await clinicRepository.getByName(name);
                if (foundClinic) {
                    clinicIds.push(
                        new mongoose.Types.ObjectId(foundClinic._id),
                    );
                }
            }
            await Service.updateOne(
                { _id: service._id },
                { $addToSet: { doctors: id, clinics: { $each: clinicIds } } },
            );

            await Doctor.updateOne(
                { _id: id },
                { $addToSet: { services: service._id } },
            );
        }

        for (const clinicName of clinicNames) {
            let clinic = await clinicRepository.getByName(clinicName);
            const doctor = await doctorRepository.getById(id);
            if (!clinic) {
                clinic = await clinicService.create({
                    name: clinicName,
                    doctors: [id],
                    services: [],
                });
            }

            await Clinic.updateOne(
                { _id: clinic._id },
                {
                    $addToSet: {
                        doctors: new mongoose.Types.ObjectId(id),
                        services: doctor.services,
                    },
                },
            );

            await Doctor.updateOne(
                { _id: id },
                { $addToSet: { clinics: clinic._id } },
            );
        }

        await doctorRepository.updateById(id, {
            phoneNumber: update.phoneNumber,
        });
        return await doctorRepository.getById(id);
    }

    public async create(data: Partial<IDoctor>): Promise<IDoctor> {
        return await doctorRepository.create(data);
    }

    public async delete(id: string) {
        await adminService.makeUser(id);
    }

    public async isDoctorExist(id: string): Promise<void> {
        const doctor = await doctorRepository.getById(id);
        if (doctor) {
            throw new ApiError(
                StatusCodeEnums.BAD_REQUEST,
                "Doctor already exists",
            );
        }
    }
}

export const doctorService = new DoctorService();
