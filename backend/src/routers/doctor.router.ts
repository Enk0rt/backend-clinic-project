import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { commonMiddleware } from "../middleware/common.middleware";

const router = Router();

router.get("/", doctorController.getAll);
router.get(
    "/:id",
    commonMiddleware.isValidated("id"),
    doctorController.getById,
);
router.put(
    "/:id",
    commonMiddleware.isValidated("id"),
    doctorController.updateById,
);
router.delete("/:id", doctorController.delete);

export const doctorRouter = router;
