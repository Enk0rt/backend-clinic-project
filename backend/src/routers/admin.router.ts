import { Router } from "express";

import { adminController } from "../controllers/admin.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";

const router = Router();

router.post(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    adminController.changeRole,
);

export const adminRouter = router;
