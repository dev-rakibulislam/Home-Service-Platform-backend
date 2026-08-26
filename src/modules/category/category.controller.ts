import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { categoryService } from "./category.service";

const getAllCategoryController = catchAsync(
	async (_: Request, res: Response) => {
		sendResponse(res, {
			code: 201,
			message: "category created successfully.",
			data: await categoryService.getAllCategoryService(),
		});
	},
);

const createCategoryController = catchAsync(
	async (req: Request, res: Response) => {
		const data = await categoryService.createCategoryService(req.body);
		sendResponse(res, {
			code: 201,
			message: "category created successfully.",
			data,
		});
	},
);

export const categoryController = {
	getAllCategoryController,
	createCategoryController,
};
