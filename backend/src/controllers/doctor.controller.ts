import { NextFunction, Request, Response } from "express";

import { StatusCodeEnums } from "../enums/status-code.enums";
import { IApiSuccessResponse } from "../interfaces/api-success-response.interface";
import {
    IDoctor,
    IDoctorQuery,
    IDoctorUpdateDTO,
} from "../interfaces/doctor.interface";
import { IUserUpdateDTO } from "../interfaces/user.interface";
import { adminService } from "../services/admin.service";
import { doctorService } from "../services/doctor.service";
import { userService } from "../services/user.service";

class DoctorController {
    public async getAll(
        req: Request,
        res: Response<IApiSuccessResponse<IDoctor[]>>,
        next: NextFunction,
    ) {
        try {
            const query = req.query as IDoctorQuery;
            const { data, total, totalPages, page, pageSize } =
                await doctorService.getAll(query);
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
        res: Response<IApiSuccessResponse<IDoctor>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const data = await doctorService.getById(id);
            res.status(StatusCodeEnums.OK).json({ data });
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IApiSuccessResponse<IDoctor>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            const dataToUpdate = req.body as IUserUpdateDTO;
            const doctorData = req.body as IDoctorUpdateDTO;
            await userService.updateUser(id, dataToUpdate);

            const data = await doctorService.update(id, doctorData);
            res.status(StatusCodeEnums.OK).json({
                data,
                details: "Doctor info is successfully updated",
            });
        } catch (e) {
            next(e);
        }
    }

    public async delete(
        req: Request,
        res: Response<IApiSuccessResponse<void | null>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            await doctorService.delete(id);
            res.status(StatusCodeEnums.OK).json({
                data: null,
                details: "Doctor is deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    public async createByAdmin(
        req: Request,
        res: Response<IApiSuccessResponse<IDoctor>>,
        next: NextFunction,
    ) {
        try {
            const data = await adminService.createDoctorByAdmin(req.body);
            res.status(StatusCodeEnums.CREATED).json({
                data,
                details: "Doctor was created successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const doctorController = new DoctorController();
