// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import { userStatusSchema } from "./userStatus.validator";
import { adminController } from "./admin.controller";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();

router.get(
	"/users",
	authMiddleware(UserRole.ADMIN),
	adminController.getAllUserController,
);

router.patch(
	"/users/:id",
	authMiddleware(UserRole.ADMIN),
	validateData(userStatusSchema),
	adminController.updateUserController,
);

router.get(
	"/bookings",
	authMiddleware(UserRole.ADMIN),
	adminController.getBookingController,
);


export const adminRouter = router;
