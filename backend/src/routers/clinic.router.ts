import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";
import { ClinicValidator } from "../validators/clinic.validator";

const router = Router();

router.get("/", authMiddleware.checkAccessToken, clinicController.getAll);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isValidated("id"),
    clinicController.getById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.DOCTOR, RoleEnums.ADMIN]),
    commonMiddleware.validateBody(ClinicValidator.createOrUpdate),
    clinicController.create,
);
router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.DOCTOR, RoleEnums.ADMIN]),
    commonMiddleware.isValidated("id"),
    commonMiddleware.validateBody(ClinicValidator.createOrUpdate),
    clinicController.updateById,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    clinicController.deleteById,
);
export const clinicRouter = router;
