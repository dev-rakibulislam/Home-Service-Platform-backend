import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { technicianService } from "./technician.service";

const createAvailabilityController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await technicianService.createAvailabilityService(
			req.body,
			req.user,
		);
		sendResponse(res, {
			code: 201,
			message: "service created successfully.",
			data,
		});
	},
);

const getAvailableTechnicianController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await technicianService.getAvailableTechnicianService();
		sendResponse(res, {
			code: 201,
			message: "all available technician find successfully.",
			data,
		});
	},
);

const getAvailableTechnicianDetailsController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await technicianService.getAvailableTechnicianDetailsService(
			req.params.id as string,
		);
		sendResponse(res, {
			code: 201,
			message: "Technician details found.",
			data,
		});
	},
);

const updateMyProfileController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await technicianService.updateMyProfileService(
			req.body,
			req.user,
		);
		sendResponse(res, {
			code: 201,
			message: "Profile updated successfully.",
			data,
		});
	},
);

export const technicianController = {
	createAvailabilityController,
	getAvailableTechnicianController,
	getAvailableTechnicianDetailsController,
	updateMyProfileController,
};
