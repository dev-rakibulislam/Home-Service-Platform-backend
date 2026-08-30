import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import type { AuthenticatedUser } from "../../types/auth";
import type { createServiceSchema } from "./service.validation";

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

const getAllService = async (filters: {
	category?: string;
	location?: string;
	minRating?: number;
	maxPrice?: number;
}) => {
	const where: Prisma.ServiceWhereInput = { isActive: true };

	if (filters.category) {
		where.category = {
			is: {
				name: { contains: filters.category, mode: "insensitive" },
			},
		};
	}
	if (filters.maxPrice !== undefined) {
		where.price = { lte: filters.maxPrice };
	}

	const technicianProfile: Prisma.TechnicianProfileWhereInput = {};
	if (filters.location) {
		technicianProfile.OR = [
			{
				user: { address: { contains: filters.location, mode: "insensitive" } },
			},
		];
	}

	if (filters.minRating !== undefined) {
		technicianProfile.avgRating = { gte: filters.minRating };
	}
	if (filters.location || filters.minRating !== undefined) {
		where.technician = technicianProfile;
	}

	const data = await prisma.service.findMany({
		where,
		include: {
			category: true,
			technician: {
				include: {
					user: { select: { id: true, name: true, address: true } },
				},
			},
		},
	});
	return data;
};

export const ServicesService = {
	createService,
	getAllService,
};
