import { Router } from "express";

import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
// import { clinicRouter } from "./clinicRouter";

const router = Router();

// public route
router.use("/users", userRouter);
router.use("/auth", authRouter);

export const apiRouter = router;
