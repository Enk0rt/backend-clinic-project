import { ObjectId } from "mongodb";

import { Doctor } from "../models/doctor.model";
import { Service } from "../models/service.model";
import { doctorRepository } from "../repositories/doctor.repository";
import { clinicService } from "../services/clinic.service";
import { doctorServicesService } from "../services/doctor-services.service";
import { normalizeNames } from "./normilize-names";

export const syncDoctorServicesAndClinics = async (
    doctorId: string,
    serviceInput: string[] | string,
    clinicInput: string[] | string,
): Promise<{ clinicIds: ObjectId[]; serviceIds: ObjectId[] }> => {
    const serviceNames = normalizeNames(serviceInput);
    const clinicNames = normalizeNames(clinicInput);

    const doctor = await doctorRepository.getById(doctorId);
    const oldServiceIds = doctor.services.map((id) => id);

    const clinicIds: ObjectId[] = [];
    for (const name of clinicNames) {
        const clinicId = await clinicService.checkClinicOrCreate(name);
        if (clinicId) clinicIds.push(clinicId);
    }

    const newServiceIds: ObjectId[] = [];
    for (const name of serviceNames) {
        const serviceId =
            await doctorServicesService.checkServiceOrCreate(name);
        if (serviceId) newServiceIds.push(serviceId);
    }

    await Doctor.updateOne(
        { _id: doctorId },
        { $set: { services: newServiceIds, clinics: clinicIds } },
    );

    const removedServiceIds = oldServiceIds.filter(
        (oldId) => !newServiceIds.map((id) => id).includes(oldId),
    );

    if (removedServiceIds) {
        for (const removedId of removedServiceIds) {
            await Service.updateOne(
                { _id: removedId },
                { $pull: { doctors: doctorId } },
            );

            await doctorServicesService.syncServiceRelations(
                new ObjectId(removedId),
            );
        }
    }

    for (const clinicId of clinicIds) {
        await clinicService.syncClinicRelations(clinicId);
    }

    for (const serviceId of newServiceIds) {
        await doctorServicesService.syncServiceRelations(serviceId);
    }

    return { clinicIds, serviceIds: newServiceIds };
};
