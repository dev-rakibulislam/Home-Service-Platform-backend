// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { bookingController } from "./booking.controller";
import { validateData } from "../../core/middleware/validator.middleware";
import { CreateBookingSchema, getBookingSchema } from "./booking.validator";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.CUSTOMER),
	validateData(CreateBookingSchema),
	bookingController.createBookingController,
);

router.get(
	"/:id",
	authMiddleware(UserRole.CUSTOMER),
	bookingController.getSingleBookingController,
);

router.get(
	"/",
	authMiddleware(UserRole.CUSTOMER),
	bookingController.getAllBookingController,
);

router.get(
	"/",
	authMiddleware(UserRole.CUSTOMER),
	bookingController.getAllBookingController,
);

export const bookingRouter = router;
