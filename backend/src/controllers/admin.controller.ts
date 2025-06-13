import { NextFunction, Request, Response } from "express";

import { RoleEnums } from "../enums/role.enums";
import { StatusCodeEnums } from "../enums/status-code.enums";
import { IApiSuccessResponse } from "../interfaces/api-success-response.interface";
import { adminService } from "../services/admin.service";
import { userService } from "../services/user.service";

class AdminController {
    public async changeRole(
        req: Request,
        res: Response<IApiSuccessResponse>,
        next: NextFunction,
    ) {
        try {
            const { role } = req.body;
            const { id } = req.params;
            switch (role) {
                case RoleEnums.ADMIN: {
                    const admin = await adminService.makeAdmin(id);
                    res.status(StatusCodeEnums.OK).json({
                        data: { admin },
                        details: "Role is updated successfully",
                    });
                    break;
                }
                case RoleEnums.USER: {
                    const user = await adminService.makeUser(id);
                    res.status(StatusCodeEnums.OK).json({
                        data: { user },
                        details: "Role is updated successfully",
                    });
                    break;
                }
                case RoleEnums.DOCTOR: {
                    const doctor = await adminService.makeDoctor(id, role);
                    res.status(StatusCodeEnums.OK).json({
                        data: { doctor },
                        details: "Role is updated successfully",
                    });
                    break;
                }
            }
        } catch (e) {
            next(e);
        }
    }

    public async deactivateUser(
        req: Request,
        res: Response<IApiSuccessResponse>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const updatedUser = await userService.updateUser(id, {
                isActive: false,
            });
            res.status(StatusCodeEnums.OK).json({
                data: updatedUser,
                details: "User is deactivated successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export const adminController = new AdminController();
