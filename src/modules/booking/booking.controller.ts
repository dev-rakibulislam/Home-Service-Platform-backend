import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { bookingService } from "./booking.service";

const createBookingController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await bookingService.createAvailabilityService(
			req.body,
			req.user,
		);

		sendResponse(res, {
			code: 201,
			message: "booking created successfully.",
			data,
		});
	},
);

const getAllBookingController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await bookingService.getMyService(req.user);

		sendResponse(res, {
			code: 200,
			message: "booking found successfully.",
			data,
		});
	},
);

const getSingleBookingController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await bookingService.getSingleBookingService(
			req.params.id as string,
		);

		sendResponse(res, {
			code: 200,
			message: "booking found successfully.",
			data,
		});
	},
);

const cancelBookingController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await bookingService.cancelBookingService(
			req.params.id as string,
		);

		sendResponse(res, {
			code: 200,
			message: "booking canceled successfully.",
			data,
		});
	},
);

export const bookingController = {
	createBookingController,
	getAllBookingController,
	getSingleBookingController,
	cancelBookingController,
};
