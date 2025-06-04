import { ObjectId } from "mongodb";

import { Doctor } from "../models/doctor.model";
import { doctorRepository } from "../repositories/doctor.repository";
import { normalizeNames } from "../utils/normilize-names";
import { clinicService } from "./clinic.service";
import { doctorServicesService } from "./doctor-services.service";

class SyncRelationsService {
    public async syncServicesAndClinics(
        doctorId: string,
        serviceInput: string[] | string,
        clinicInput: string[] | string,
    ): Promise<{ clinicIds: ObjectId[]; serviceIds: ObjectId[] }> {
        const doctor = await doctorRepository.getById(doctorId);

        const oldServiceIds = doctor.services.map((id) => id);
        const oldClinicIds = doctor.clinics.map((id) => id);

        const clinicIds = await this.getClinicIds(clinicInput);
        const serviceIds = await this.getServiceIds(serviceInput);

        await this.updateDoctor(doctorId, clinicIds, serviceIds);

        const allServiceIds = this.mergeUniqueIds(oldServiceIds, serviceIds);
        const allClinicIds = this.mergeUniqueIds(oldClinicIds, clinicIds);

        for (const id of allServiceIds) {
            await doctorServicesService.syncServiceRelations(id);
        }

        for (const id of allClinicIds) {
            await clinicService.syncClinicRelations(id);
        }

        return { clinicIds, serviceIds };
    }

    private async getClinicIds(input: string[] | string): Promise<ObjectId[]> {
        const names = normalizeNames(input);
        const ids: ObjectId[] = [];

        for (const name of names) {
            const id = await clinicService.checkClinicOrCreate(name);
            if (id) ids.push(id);
        }

        return ids;
    }

    private async getServiceIds(input: string[] | string): Promise<ObjectId[]> {
        const names = normalizeNames(input);
        const ids: ObjectId[] = [];

        for (const name of names) {
            const id = await doctorServicesService.checkServiceOrCreate(name);
            if (id) ids.push(id);
        }

        return ids;
    }

    private async updateDoctor(
        doctorId: string,
        clinics: ObjectId[],
        services: ObjectId[],
    ) {
        await Doctor.updateOne(
            { _id: doctorId },
            { $set: { services, clinics } },
        );
    }
    private mergeUniqueIds(...lists: ObjectId[][]): ObjectId[] {
        const map = new Map<string, ObjectId>();
        for (const list of lists) {
            for (const id of list) {
                map.set(id.toString(), id);
            }
        }
        return [...map.values()];
    }
}

export const syncRelationsService = new SyncRelationsService();
