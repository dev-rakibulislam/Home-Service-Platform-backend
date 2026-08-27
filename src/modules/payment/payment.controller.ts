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

const verifyPaymentController = catchAsync(
	async (req: Request, res: Response) => {
		const { tran_id, val_id } = req.body;

		const result = await paymentService.verifyPaymentService(tran_id, val_id);

		sendResponse(res, {
			code: 201,
			message: "result",
			data: result,
		});
	},
);

const failPaymentController = catchAsync(
	async (req: Request, res: Response) => {
		const data = req.body;
		const { message, paymentStatus, transactionId } =
			await paymentService.failPaymentService(data);

		sendResponse(res, {
			code: 201,
			message: message,
			data: { paymentStatus, transactionId },
		});
	},
);

export const paymentController = {
	createPaymentController,
	failPaymentController,
	verifyPaymentController,
};
