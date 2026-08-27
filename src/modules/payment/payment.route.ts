// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import { createPaymentSchema } from "./payment.validator";
import { paymentController } from "./payment.controller";
import { config } from "../../config/env";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.CUSTOMER),
	validateData(createPaymentSchema),
	paymentController.createPaymentController,
);

router.post("/success", paymentController.verifyPaymentController);


export const paymentRouter = router;
