import mongoose from "mongoose";

import { IService } from "../interfaces/service.interface";
import { doctorServicesRepository } from "../repositories/doctor-services.repository";
import { doctorServicesService } from "../services/doctor-services.service";

export const checkServicesExistAndReturnId = async (
    services: string[] | string | undefined | null,
): Promise<mongoose.Types.ObjectId[]> => {
    if (!services) return [];

    const normalizedServicesNames = (
        Array.isArray(services) ? services : services.split(",")
    )
        .filter((service): service is string => typeof service === "string")
        .map((service) => service.trim().toLowerCase())
        .filter((service) => service.length > 0);

    const uniqueServicesNames = [...new Set(normalizedServicesNames)];

    if (uniqueServicesNames.length === 0) return [];

    const existingServices =
        await doctorServicesService.getByNames(uniqueServicesNames);
    const existingNames = existingServices.map((service) => service.name);

    const newNames = uniqueServicesNames.filter(
        (name) => !existingNames.includes(name),
    );

    let createdServices = [];
    if (newNames.length > 0) {
        createdServices = await Promise.all(
            newNames.map((name) =>
                doctorServicesRepository.create({ name } as IService),
            ),
        );
    }

    return [...existingServices, ...createdServices].map(
        (service) => service._id,
    );
};
