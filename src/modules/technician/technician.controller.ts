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

const getMyAvailabilityController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await technicianService.getMyAvailabilityService(req.user);
    console.log(
      "TECHNICIAN DETAILS:",
      req.method,
      req.originalUrl,
      req.params.id,
    );
    sendResponse(res, {
      code: 200,
      message: "Availability retrieved successfully.",
      data,
    });
  },
);

const deleteAvailabilityController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await technicianService.deleteAvailabilityService(
      req.params.id as string,
      req.user,
    );

    sendResponse(res, {
      code: 200,
      message: "Availability deleted successfully.",
      data,
    });
  },
);


const getAvailableTechnicianController = catchAsync(
	async (req: Request, res: Response) => {
		const filters = {
			location: req.query.location as string | undefined,
			minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
			maxRate: req.query.maxRate ? Number(req.query.maxRate) : undefined,
			minExperience: req.query.minExperience
				? Number(req.query.minExperience)
				: undefined,
		};
		const data = await technicianService.getAvailableTechnicianService(filters);
		sendResponse(res, {
			code: 200,
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
			code: 200,
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

const getPendingBookingController = catchAsync(
	async (req: Request, res: Response) => {

		const data = await technicianService.getPendingBookingService(req.user);
		sendResponse(res, {
			code: 200,
			message: "Pending Booking get successfully.",
			data,
		});
	},
);

const getMyBookingsController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await technicianService.getMyBookingsService(req.user);

    sendResponse(res, {
      code: 200,
      message: "My bookings retrieved successfully.",
      data,
    });
  },
);

const getUpdatePendingBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await technicianService.getUpdatePendingBookingService(
      req.params.id as string,
      req.body,
      req.user,
    );

    sendResponse(res, {
      code: 200,
      message: "Booking updated successfully.",
      data,
    });
  },
);

export const technicianController = {
  createAvailabilityController,
  getAvailableTechnicianController,
  getAvailableTechnicianDetailsController,
  updateMyProfileController,
  getPendingBookingController,
  getUpdatePendingBookingController,
  getMyAvailabilityController,
  deleteAvailabilityController,
  getMyBookingsController,
};
