import { Router } from "express";

import { doctorServicesController } from "../controllers/doctor-services.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";

const router = Router();

router.get("/", doctorServicesController.getAll);
router.get(
    "/:id",
    commonMiddleware.isValidated("id"),
    authMiddleware.checkAccessToken,
    doctorServicesController.getById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    authMiddleware.checkAccessToken,
    doctorServicesController.create,
);
router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    commonMiddleware.isValidated("id"),
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
