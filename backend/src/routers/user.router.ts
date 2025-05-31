import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middleware/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAll);
router.get("/:id", commonMiddleware.isValidated("id"), userController.getById);
router.put(
    "/:id",
    commonMiddleware.isValidated("id"),
    commonMiddleware.validateBody(UserValidator.update),
    userController.updateById,
);
router.delete(
    "/:id",
    commonMiddleware.isValidated("id"),
    userController.delete,
);

export const userRouter = router;
