// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { authController } from "./auth.controller";
import { userLoginSchema, userRegisterSchema } from "./auth.validator";
import { validateData } from "../../core/middleware/validator.middleware";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
const router = Router();

router.post(
	"/register",
	validateData(userRegisterSchema),
	authController.registerUserController,
);

router.post(
	"/login",
	validateData(userLoginSchema),
	authController.loginUserController,
);

router.get(
	"/me",
	authMiddleware(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.CUSTOMER),
	authController.getMyProfileController,
);

export const authRouter = router;
