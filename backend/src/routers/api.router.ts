import { Router } from "express";

import { adminRouter } from "./admin.router";
import { authRouter } from "./auth.router";
import { clinicRouter } from "./clinic.router";
import { doctorRouter } from "./doctor.router";
import { serviceRouter } from "./service.router";
import { userRouter } from "./user.router";

const router = Router();

// public route
router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/doctors", doctorRouter);
router.use("/clinics", clinicRouter);
router.use("/services", serviceRouter);

export const apiRouter = router;
