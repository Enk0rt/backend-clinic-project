import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";
import { DoctorValidator } from "../validators/doctor.validator";

const router = Router();

router.get("/", doctorController.getAll);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isValidated("id"),
    doctorController.getById,
);
router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN, RoleEnums.DOCTOR]),
    commonMiddleware.isValidated("id"),
    commonMiddleware.validateBody(DoctorValidator.updateDoctor),
    doctorController.updateById,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    commonMiddleware.isValidated("id"),
    doctorController.delete,
);

router.post(
    "/",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    commonMiddleware.validateBody(DoctorValidator.createDoctor),
    doctorController.createByAdmin,
);

export const doctorRouter = router;
