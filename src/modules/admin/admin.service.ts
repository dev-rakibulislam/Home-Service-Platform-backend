import { prisma } from "../../config/prisma";
import type { CreateCategoryPayload } from "./category.validator";

const getAllUserService = async () => {
	const result = await prisma.user.findMany({
		include: { technicianProfile: true },
	});
	return result;
};

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
	getAllUserService,
	getAllCategoryService,
	createCategoryService,
};
