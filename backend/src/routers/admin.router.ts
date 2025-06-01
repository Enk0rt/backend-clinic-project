import { Router } from "express";

import { adminController } from "../controllers/admin.controller";

const router = Router();

router.post("/:id", adminController.changeRole);

export const adminRouter = router;
