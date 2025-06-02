import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";

const router = Router();

router.get("/", doctorController.getAll);
router.get(
    "/:id",
    commonMiddleware.isValidated("id"),
    doctorController.getById,
);
router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN, RoleEnums.DOCTOR]),
    commonMiddleware.isValidated("id"),
    doctorController.updateById,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN, RoleEnums.DOCTOR]),
    doctorController.delete,
);
router.post("/", doctorController.createByAdmin);

export const doctorRouter = router;
