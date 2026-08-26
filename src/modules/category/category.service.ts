import { prisma } from "../../config/prisma";
import type { CreateCategoryPayload } from "../category/category.validator";

const getAllCategoryService = async () => {
	const result = await prisma.category.findMany();
	return result;
};

const createCategoryService = async (payload: CreateCategoryPayload) => {
	const result = await prisma.category.create({
		data: { ...payload },
	});
	return result;
};

export const categoryService = {
	getAllCategoryService,
	createCategoryService,
};
