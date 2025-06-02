import { NextFunction, Request, Response } from "express";

import { RoleEnums } from "../enums/role.enums";
import { StatusCodeEnums } from "../enums/status-code.enums";
import { ApiError } from "../errors/api.error";
import { IApiSuccessResponse } from "../interfaces/api-success-response.interface";
import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { IUser, IUserUpdateDTO } from "../interfaces/user.interface";
import { adminService } from "../services/admin.service";
import { doctorService } from "../services/doctor.service";
import { userService } from "../services/user.service";

class DoctorController {
    public async getAll(
        req: Request,
        res: Response<IApiSuccessResponse<{ doctors: IDoctor[] }>>,
        next: NextFunction,
    ) {
        try {
            const doctors = await doctorService.getAll();
            res.status(StatusCodeEnums.OK).json({ data: { doctors: doctors } });
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
            const doctor = await doctorService.getById(id);
            res.status(StatusCodeEnums.OK).json({ data: doctor });
        } catch (e) {
            next(e);
        }
    }

    public async updateById(
        req: Request,
        res: Response<IApiSuccessResponse<{ user: IUser }>>,
        next: NextFunction,
    ) {
        try {
            const isDoctor = req.body.role[RoleEnums.DOCTOR] as IUser;
            const { id } = req.params;
            const userData = req.body as IUserUpdateDTO;

            if (!isDoctor) {
                next(
                    new ApiError(
                        StatusCodeEnums.FORBIDDEN,
                        "Doctor role is needed",
                    ),
                );
            }
            const doctorData = req.body as IDoctorDTO;
            const updatedUser = await userService.updateUser(id, {
                ...userData,
                ...doctorData,
            });
            res.status(StatusCodeEnums.OK).json({
                data: { user: updatedUser },
                details: "Doctor info is successfully updated",
            });
        } catch (e) {
            next(e);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await doctorService.delete(id);
            res.status(StatusCodeEnums.OK).json({
                details: "Doctor is deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    public async createByAdmin(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const doctor = await adminService.createDoctorByAdmin(req.body);
            res.status(StatusCodeEnums.CREATED).json({
                data: { doctor },
                details: "Doctor was created successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const doctorController = new DoctorController();
