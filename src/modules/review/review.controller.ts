// biome-ignore assist/source/organizeImports: <explanation>
import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { reviewService } from "./review.service";

const createReviewController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await reviewService.createReviewService(
			req.params.id as string,
			req.user,
			req.body,
		);

		sendResponse(res, {
			code: 201,
			message: "Review created successfully.",
			data,
		});
	},
);
export const reviewController = {
	createReviewController,
};
