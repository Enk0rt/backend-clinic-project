import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { doctorServicesService } from "../services/doctor-services.service";

class DoctorServicesController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const services = await doctorServicesService.getAll();
            res.status(StatusCodeEnums.OK).json(services);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const services = await doctorServicesService.getById(id);
            res.status(StatusCodeEnums.OK).json(services);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const service = await doctorServicesService.create(data);
            res.status(StatusCodeEnums.OK).json(service);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = req.body;
            const service = await doctorServicesService.updateById(id, data);
            res.status(StatusCodeEnums.OK).json(service);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await doctorServicesService.delete(id);
            res.status(StatusCodeEnums.OK).json({
                details: "Service is deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const doctorServicesController = new DoctorServicesController();
