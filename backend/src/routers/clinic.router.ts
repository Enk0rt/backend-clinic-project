import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { commonMiddleware } from "../middleware/common.middleware";

const router = Router();

router.get("/", clinicController.getAll);
router.get(
    "/:id",
    commonMiddleware.isValidated("id"),
    clinicController.getById,
);
router.post("/", clinicController.create);
router.put(
    "/:id",
    commonMiddleware.isValidated("id"),
    clinicController.updateById,
);

export const clinicRouter = router;
