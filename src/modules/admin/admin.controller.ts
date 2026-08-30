import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { categoryService } from "./admin.service";
import { BookingStatus } from "../../../generated/prisma/enums";

const getAllUserController = catchAsync(async (_: Request, res: Response) => {
	sendResponse(res, {
		code: 200,
		message: "user fetch successfully.",
		data: await categoryService.getAllUserService(),
	});
});

const updateUserController = catchAsync(async (req: Request, res: Response) => {
	const id = req.params?.id;
	if (!id) {
		return sendResponse(res, {
			code: 404,
			message: "id not found.",
		});
	}
	const data = await categoryService.updateUserService(
		id as string,
		req.body.status,
	);
	sendResponse(res, {
		code: 200,
		message: "user fetch successfully.",
		data,
	});
});

const getBookingController = catchAsync(async (req: Request, res: Response) => {
	const filters = {
		status: req.query.status as BookingStatus | undefined,
		customerId: req.query.customerId as string | undefined,
		technicianId: req.query.technicianId as string | undefined,
		page: req.query.page ? Number(req.query.page) : 1,
		limit: req.query.limit ? Number(req.query.limit) : 20,
		fromDate: req.query.fromDate
			? new Date(req.query.fromDate as string)
			: undefined,

		toDate: req.query.toDate ? new Date(req.query.toDate as string) : undefined,
	};

	const { data, metaData } = await categoryService.getBookingsService(filters);
	sendResponse(res, {
		code: 200,
		message: "Booking fetch successfully.",
		data,
		metaData,
	});
});

const getCategoryController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await categoryService.getCategoryService();
		sendResponse(res, {
			code: 200,
			message: "Category fetch successfully.",
			data,
		});
	},
);

export const adminController = {
	getAllUserController,
	updateUserController,
	getBookingController,
	getCategoryController,
};
