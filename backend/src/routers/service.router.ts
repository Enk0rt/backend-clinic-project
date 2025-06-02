import { Router } from "express";

import { doctorServicesController } from "../controllers/doctor-services.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", doctorServicesController.getAll);
router.get("/:id", doctorServicesController.getById);
router.post(
    "/",
    authMiddleware.checkAccessToken,
    doctorServicesController.create,
);
router.put("/:id", doctorServicesController.updateById);
router.delete("/:id", doctorServicesController.deleteById);

export const serviceRouter = router;
