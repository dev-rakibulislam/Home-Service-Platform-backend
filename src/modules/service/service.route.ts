// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { serviceController } from "./service.controller";
import { validateData } from "../../core/middleware/validator.middleware";
import { createServiceSchema } from "./service.validation";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.TECHNICIAN),
	validateData(createServiceSchema),
	serviceController.createServiceController,
);

router.get("/", serviceController.getServiceController);

export const serviceRouter = router;
