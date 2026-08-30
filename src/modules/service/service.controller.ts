import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { ServicesService } from "./service.service";

const createServiceController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await ServicesService.createService(req.body, req.user);

		sendResponse(res, {
			code: 201,
			message: "service created successfully.",
			data,
		});
	},
);

const getServiceController = catchAsync(async (req: Request, res: Response) => {
	const q = req.query;

	const data = await ServicesService.getAllService({
		category: typeof q.category === "string" ? q.category : undefined,
		location: typeof q.location === "string" ? q.location : undefined,
		minRating: q.minRating ? Number(q.minRating) : undefined,
		maxPrice: q.maxPrice ? Number(q.maxPrice) : undefined,
	});
	sendResponse(res, {
		code: 200,
		message: "all service get successfully.",
		data,
	});
});

export const serviceController = {
	createServiceController,
	getServiceController,
};
