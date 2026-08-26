import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import { AuthenticatedUser } from "../../types/auth";
import { createServiceSchema } from "./service.validation";

const createService = async (
	payload: createServiceSchema,
	userData: AuthenticatedUser,
) => {
	const category = await prisma.category.findUnique({
		where: { id: payload.categoryId },
	});

	if (!category) {
		throw new AppError(404, "Category not found!");
	}

	const technician = await prisma.technicianProfile.findUnique({
		where: {
			userId: userData.id,
		},
	});

	if (!technician) {
		throw new AppError(404, "technician not found!");
	}

	const { categoryId, description, name, price, duration } = payload;

	const result = await prisma.service.create({
		data: {
			duration,
			name,
			price,
			categoryId,
			description,
			technicianId: technician.id,
		},
	});
	return result;
};

export const ServicesService = {
	createService,
};
