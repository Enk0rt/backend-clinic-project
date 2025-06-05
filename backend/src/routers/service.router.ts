import { Router } from "express";

import { doctorServicesController } from "../controllers/doctor-services.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";
import { ServiceValidator } from "../validators/service.validator";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    doctorServicesController.getAll,
);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isValidated("id"),
    doctorServicesController.getById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    commonMiddleware.validateBody(ServiceValidator.createOrUpdate),
    doctorServicesController.create,
);
router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    commonMiddleware.isValidated("id"),
    commonMiddleware.validateBody(ServiceValidator.createOrUpdate),
    doctorServicesController.updateById,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    commonMiddleware.isValidated("id"),
    doctorServicesController.deleteById,
);

export const serviceRouter = router;
