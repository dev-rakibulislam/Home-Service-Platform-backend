// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { bookingController } from "./booking.controller";
import { validateData } from "../../core/middleware/validator.middleware";
import { CreateBookingSchema } from "./booking.validator";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.TECHNICIAN),
  validateData(CreateBookingSchema),
	bookingController.createBookingController,
);

export const bookingRouter = router;
