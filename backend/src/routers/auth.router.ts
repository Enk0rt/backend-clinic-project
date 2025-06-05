import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";
import { AuthValidator } from "../validators/auth.validator";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(UserValidator.createUser),
    authController.signUp,
);
router.post(
    "/sign-in",
    commonMiddleware.validateBody(AuthValidator.signIn),
    authController.signIn,
);

router.get("/me", authMiddleware.checkAccessToken, authController.me);

router.delete(
    "/me",
    authMiddleware.checkAccessToken,
    authMiddleware.checkAccessToken,
    authController.deleteMe,
);

router.post(
    "/refresh",
    commonMiddleware.validateBody(AuthValidator.refreshToken),
    authMiddleware.checkRefreshToken,
    authController.refresh,
);

router.get("/verify/:token", authController.verify);
router.post(
    "/verify/:id",
    commonMiddleware.isValidated("id"),
    commonMiddleware.validateBody(AuthValidator.validateToken),
    authController.verifyRequest,
);
router.patch(
    "/verify/:token",
    commonMiddleware.isValidated("token"),
    authController.verify,
);

router.patch(
    "/recovery/:token",
    commonMiddleware.isValidated("token"),
    commonMiddleware.validateBody(AuthValidator.validatePassword),
    authController.recoveryPassword,
);
router.post(
    "/recovery",
    commonMiddleware.validateBody(AuthValidator.validateEmail),
    authController.recoveryPasswordRequest,
);

export const authRouter = router;
