import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { RoleEnums } from "../enums/role.enums";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
    "/",
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    userController.getAll,
);
router.get(
    "/:id",
    commonMiddleware.isValidated("id"),
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    userController.getById,
);
router.put(
    "/:id",
    commonMiddleware.isValidated("id"),
    commonMiddleware.validateBody(UserValidator.update),
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    userController.updateById,
);
router.delete(
    "/:id",
    commonMiddleware.isValidated("id"),
    authMiddleware.checkAccessToken,
    permissionMiddleware.checkRole([RoleEnums.ADMIN]),
    userController.delete,
);

export const userRouter = router;
