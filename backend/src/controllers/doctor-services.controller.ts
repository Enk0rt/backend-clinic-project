import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { IApiSuccessResponse } from "../interfaces/api-success-response.interface";
import { IService, IServiceQuery } from "../interfaces/service.interface";
import { doctorServicesService } from "../services/doctor-services.service";

class DoctorServicesController {
    public async getAll(
        req: Request,
        res: Response<IApiSuccessResponse<IService[]>>,
        next: NextFunction,
    ) {
        try {
            const query = req.query as IServiceQuery;
            const { data, page, pageSize, total, totalPages } =
                await doctorServicesService.getAll(query);
            res.status(StatusCodeEnums.OK).json({
                data,
                pageSize,
                page,
                total,
                totalPages,
            });
        } catch (e) {
            next(e);
        }
    }

    public async getById(
        req: Request,
        res: Response<IApiSuccessResponse<IService>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const data = await doctorServicesService.getById(id);
            res.status(StatusCodeEnums.OK).json({ data });
        } catch (e) {
            next(e);
        }
    }

    public async create(
        req: Request,
        res: Response<IApiSuccessResponse<IService>>,
        next: NextFunction,
    ) {
        try {
            const createData = req.body as Partial<IService>;
            const data = await doctorServicesService.create(createData);
            res.status(StatusCodeEnums.OK).json({ data });
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IApiSuccessResponse<IService>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const dataToUpdate = req.body;
            const data = await doctorServicesService.updateById(
                id,
                dataToUpdate,
            );
            res.status(StatusCodeEnums.OK).json({ data });
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
            await doctorServicesService.delete(id);
            res.status(StatusCodeEnums.OK).json({
                data: null,
                details: "Service is deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const doctorServicesController = new DoctorServicesController();
