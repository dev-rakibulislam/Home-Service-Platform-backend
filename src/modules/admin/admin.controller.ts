import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { categoryService } from "./admin.service";

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


export const adminController = {
	getAllUserController,
	updateUserController,
};
