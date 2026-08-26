// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import { createAvailabilitySchema } from "./technician.validator";
import { technicianController } from "./technician.controller";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.TECHNICIAN),
	validateData(createAvailabilitySchema),
	technicianController.createAvailabilityController,
);

export const technicianRouter = router;
