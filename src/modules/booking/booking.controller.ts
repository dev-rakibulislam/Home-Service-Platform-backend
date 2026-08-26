import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { bookingService } from "./booking.service";

const createBookingController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await bookingService.createAvailabilityService();

		sendResponse(res, {
			code: 201,
			message: "service created successfully.",
			data,
		});
	},
);

export const bookingController = {
	createBookingController,
};
