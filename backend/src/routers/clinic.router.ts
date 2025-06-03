import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";

const router = Router();

router.get("/", authMiddleware.checkAccessToken, clinicController.getAll);
router.get(
    "/:id",
    commonMiddleware.isValidated("id"),
    authMiddleware.checkAccessToken,
    clinicController.getById,
);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.DOCTOR, RoleEnums.ADMIN]),
    clinicController.create,
);
router.put(
    "/:id",
    commonMiddleware.isValidated("id"),
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.DOCTOR, RoleEnums.ADMIN]),
    clinicController.updateById,
);
router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    clinicController.deleteById,
);
export const clinicRouter = router;
