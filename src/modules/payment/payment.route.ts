// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../core/middleware/authentication";
import { validateData } from "../../core/middleware/validator.middleware";
import { createPaymentSchema } from "./payment.validator";
import { paymentController } from "./payment.controller";
const router = Router();

router.post(
	"/",
	authMiddleware(UserRole.CUSTOMER),
	validateData(createPaymentSchema),
	paymentController.createPaymentController,
);

router.post("/success", paymentController.verifyPaymentController);
router.post("/fail", paymentController.failPaymentController);

router.get(
	"/",
	authMiddleware(UserRole.CUSTOMER),
	paymentController.getMyPaymentPaymentController,
);

router.get(
	"/:id",
	authMiddleware(UserRole.CUSTOMER),
	paymentController.getSinglePaymentController,
);

export const paymentRouter = router;
