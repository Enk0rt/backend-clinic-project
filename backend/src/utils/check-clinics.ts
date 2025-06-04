import mongoose from "mongoose";

import { IClinic } from "../interfaces/clinic.interface";
import { clinicRepository } from "../repositories/clinic.repository";
import { clinicService } from "../services/clinic.service";

export const checkClinicsExistAndReturnId = async (
    clinics: string[] | string,
): Promise<{
    existing: IClinic[];
    created: IClinic[];
    clinicsId: mongoose.Types.ObjectId[];
}> => {
    if (!clinics) return { existing: [], created: [], clinicsId: [] };

    const normalizedClinicNames = (
        Array.isArray(clinics) ? clinics : clinics.split(",")
    )
        .filter((clinic): clinic is string => typeof clinic === "string")
        .map((clinic) => clinic.trim().toLowerCase())
        .filter((clinic) => clinic.length > 0);

    const uniqueClinicNames = [...new Set(normalizedClinicNames)];

    if (uniqueClinicNames.length === 0)
        return { existing: [], created: [], clinicsId: [] };

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

    const all = [...existingClinics, ...createdClinics];
    return {
        existing: existingClinics,
        created: createdClinics,
        clinicsId: all.map((clinic) => clinic._id),
    };
};
