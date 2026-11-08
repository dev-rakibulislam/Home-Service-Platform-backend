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

const technicianAuth = authMiddleware(UserRole.TECHNICIAN);

router.post("/", technicianAuth, serviceController.createServiceController);

router.get("/", serviceController.getServicesController);

router.get("/homepage", serviceController.getHomepageServicesController);

router.get("/my-services", technicianAuth, serviceController.getMyServicesController);

router.patch("/:id", technicianAuth, serviceController.updateMyServiceController);

router.delete("/:id", technicianAuth, serviceController.deleteMyServiceController);

router.get("/:id", serviceController.getServiceDetailsController);

export const serviceRouter = router;
