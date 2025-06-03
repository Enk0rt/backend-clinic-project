import mongoose from "mongoose";

import { IClinic } from "../interfaces/clinic.interface";
import { clinicRepository } from "../repositories/clinic.repository";
import { clinicService } from "../services/clinic.service";

export const checkClinicsExistAndReturnId = async (
    clinics: string[] | string,
): Promise<mongoose.Types.ObjectId[]> => {
    if (!clinics) return [];

    if (!clinics) return [];

    const normalizedClinicNames = (
        Array.isArray(clinics) ? clinics : clinics.split(",")
    )
        .filter((clinic): clinic is string => typeof clinic === "string")
        .map((clinic) => clinic.trim().toLowerCase())
        .filter((clinic) => clinic.length > 0);

    const uniqueClinicNames = [...new Set(normalizedClinicNames)];

    if (uniqueClinicNames.length === 0) return [];

    const existingClinics = await clinicService.getByNames(uniqueClinicNames);
    const existingNames = existingClinics.map((service) => service.name);

    const newNames = uniqueClinicNames.filter(
        (name) => !existingNames.includes(name),
    );

    let createdClinics = [];
    if (newNames.length > 0) {
        createdClinics = await Promise.all(
            newNames.map((name) =>
                clinicRepository.create({ name } as IClinic),
            ),
        );
    }

    return [...existingClinics, ...createdClinics].map(
        (service) => service._id,
    );
};
