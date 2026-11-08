// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import {
	createAvailabilitySchema,
	updateBookingSchema,
} from "./technician.validator";

import { technicianController } from "./technician.controller";
import { technicianProfileUpdateSchema } from "../auth/auth.validator";

const router = Router();

// Availability routes
router.post(
  "/",
  authMiddleware(UserRole.TECHNICIAN),
  validateData(createAvailabilitySchema),
  technicianController.createAvailabilityController,
);

router.get(
  "/bookings",
  authMiddleware(UserRole.TECHNICIAN),
  technicianController.getMyBookingsController,
);



router.get(
  "/availability",
  authMiddleware(UserRole.TECHNICIAN),
  technicianController.getMyAvailabilityController,
);

router.delete(
  "/availability/:id",
  authMiddleware(UserRole.TECHNICIAN),
  technicianController.deleteAvailabilityController,
);

// Technician listing
router.get("/", technicianController.getAvailableTechnicianController);

// Profile
router.put(
  "/update-profile",
  authMiddleware(UserRole.TECHNICIAN),
  validateData(technicianProfileUpdateSchema),
  technicianController.updateMyProfileController,
);

// Bookings
router.get(
  "/pending-booking",
  authMiddleware(UserRole.TECHNICIAN),
  technicianController.getPendingBookingController,
);

router.post(
  "/update-booking/:id",
  authMiddleware(UserRole.TECHNICIAN),
  validateData(updateBookingSchema),
  technicianController.getUpdatePendingBookingController,
);

// Always last
router.get(
  "/:id",
  technicianController.getAvailableTechnicianDetailsController,
);

export const technicianRouter = router;
