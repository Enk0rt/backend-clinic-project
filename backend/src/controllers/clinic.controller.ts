import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { IApiSuccessResponse } from "../interfaces/api-success-response.interface";
import {
    IClinic,
    IClinicDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { clinicService } from "../services/clinic.service";

class ClinicController {
    public async getAll(
        req: Request,
        res: Response<IApiSuccessResponse<IClinic[]>>,
        next: NextFunction,
    ) {
        try {
            const query = req.query as IClinicQuery;
            const { data, page, pageSize, totalPages, total } =
                await clinicService.getAll(query);
            res.status(StatusCodeEnums.OK).json({
                data,
                pageSize,
                page,
                totalPages,
                total,
            });
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const clinics = await clinicService.getById(id);
            res.status(StatusCodeEnums.OK).json(clinics);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const clinicData = req.body as IClinicDTO;
            const clinic = await clinicService.create(clinicData);
            res.status(StatusCodeEnums.CREATED).json({
                clinic: clinic,
                details: "New Clinic is created successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const clinicData = req.body as IClinicDTO;
            const updatedClinic = await clinicService.updateById(
                id,
                clinicData,
            );
            res.status(StatusCodeEnums.OK).json({
                clinic: updatedClinic,
                details: "Clinic info is updated successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await clinicService.delete(id);
            res.status(StatusCodeEnums.OK).json({
                details: "Clinic is deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const clinicController = new ClinicController();
