// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import { userStatusSchema } from "./userStatus.validator";
import { adminController } from "./admin.controller";
const router = Router();

router.get(
	"/users",
	authMiddleware("ADMIN"),
	adminController.getAllUserController,
);

router.patch(
	"/users/:id",
	authMiddleware("ADMIN"),
	validateData(userStatusSchema),
	adminController.updateUserController,
);

// router.get(
// 	"/bookings",
// 	authMiddleware("ADMIN"),
// 	categoryController.getAllCategoryController,
// );


export const adminRouter = router;
