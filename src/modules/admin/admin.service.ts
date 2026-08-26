import type { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import { getExistingUser } from "../../core/utils/getExistingUser";
import type { CreateCategoryPayload } from "./category.validator";

const getAllUserService = async () => {
	const result = await prisma.user.findMany({
		include: { technicianProfile: true },
	});
	return result;
};

const updateUserService = async (id: string, status: UserStatus) => {
	const data = await getExistingUser({ id });
	if (data === null) {
		throw new AppError(404, "user Not found");
	}
	const result = await prisma.user.update({
		where: { id },
		data: { status },
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
	updateUserService,
	getAllCategoryService,
	createCategoryService,
};
