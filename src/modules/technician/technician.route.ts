// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import { createAvailabilitySchema } from "./technician.validator";
import { technicianController } from "./technician.controller";
import { technicianProfileUpdateSchema } from "../auth/auth.validator";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.TECHNICIAN),
	validateData(createAvailabilitySchema),
	technicianController.createAvailabilityController,
);

router.get(
	"/",
//! fintering 
	technicianController.getAvailableTechnicianController,
);


router.put(
	"/update-profile",
	authMiddleware(UserRole.TECHNICIAN),
	validateData(technicianProfileUpdateSchema),
	technicianController.updateMyProfileController,
);

router.get(
	"/:id",
	technicianController.getAvailableTechnicianDetailsController,
);

export const technicianRouter = router;
