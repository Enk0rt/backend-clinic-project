import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middleware/common.middleware";
import { AuthValidator } from "../validators/auth.validator";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(UserValidator.create),
    authController.signUp,
);
router.post(
    "/sign-in",
    commonMiddleware.validateBody(AuthValidator.signIn),
    authController.signIn,
);

export const authRouter = router;
