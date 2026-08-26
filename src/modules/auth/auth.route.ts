// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { authController } from "./auth.controller";
import { userRegisterSchema } from "./auth.validator";
import { validateData } from "../../core/middleware/validator.middleware";
const router = Router();

router.post(
	"/register",
	validateData(userRegisterSchema),
	authController.registerUserController,
);

export const authRouter = router;
