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

router.post("/success", async (req, res) => {
	const { tran_id, val_id } = req.body;

	const validationUrl =
		"https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php" +
		`?val_id=${val_id}` +
		`&store_id=${config.sslcommerz.storeId}` +
		`&store_passwd=${config.sslcommerz.storePassword}` +
		`&format=json`;

	const response = await fetch(validationUrl);
	const validation = await response.json();
	console.log(validation);
	// const result = await paymentService.success(req.body);

	// sendResponse(res, {
	// 	code: 200,
	// 	message: "Payment successful",
	// 	data: result,
	// });
});
router.post("/ipn", (req, res) => {
	console.log(req);
	res.send("nothing");
});

export const paymentRouter = router;
