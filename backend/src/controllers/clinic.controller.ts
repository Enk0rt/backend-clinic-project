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

    public async getById(
        req: Request,
        res: Response<IApiSuccessResponse<IClinic>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const data = await clinicService.getById(id);
            res.status(StatusCodeEnums.OK).json({ data });
        } catch (e) {
            next(e);
        }
    }

    public async create(
        req: Request,
        res: Response<IApiSuccessResponse<IClinic>>,
        next: NextFunction,
    ) {
        try {
            const createData = req.body as IClinicDTO;
            const data = await clinicService.create(createData);
            res.status(StatusCodeEnums.CREATED).json({
                data,
                details: "New Clinic is created successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IApiSuccessResponse<IClinic>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const dataToUpdate = req.body as IClinicDTO;
            const data = await clinicService.updateById(id, dataToUpdate);
            res.status(StatusCodeEnums.OK).json({
                data,
                details: "Clinic info is updated successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(
        req: Request,
        res: Response<IApiSuccessResponse<void | null>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await clinicService.delete(id);
            res.status(StatusCodeEnums.OK).json({
                data: null,
                details: "Clinic is deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const clinicController = new ClinicController();
