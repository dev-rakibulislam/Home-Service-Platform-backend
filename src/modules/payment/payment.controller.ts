import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { paymentService } from "./payment.service";

const createPaymentController = catchAsync(
	async (req: Request, res: Response) => {
		const { message, paymentUrl, transactionId } =
			await paymentService.createPaymentService(req.body, req.user);

		sendResponse(res, {
			code: 201,
			message: message,
			data: { transactionId, paymentUrl },
		});
	},
);

export const paymentController = {
	createPaymentController,
};
