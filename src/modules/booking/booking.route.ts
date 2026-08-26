// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import { bookingController } from "./booking.controller";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.TECHNICIAN),
	bookingController.createBookingController,
);

export const bookingRouter = router;
