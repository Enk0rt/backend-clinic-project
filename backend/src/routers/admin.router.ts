import { Router } from "express";

import { adminController } from "../controllers/admin.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";

const router = Router();

router.post(
    "/:id",
    commonMiddleware.isValidated("id"),
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    adminController.changeRole,
);
router.patch(
    "/deactivate/:id",
    commonMiddleware.isValidated("id"),
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    adminController.deactivateUser,
);

export const adminRouter = router;
