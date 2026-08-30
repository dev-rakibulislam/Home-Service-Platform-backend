import { Prisma } from "../../../generated/prisma/client";
import type {
	BookingStatus,
	UserStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import { getExistingUser } from "../../core/utils/getExistingUser";

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

const getBookingsService = async (filters: {
	status?: BookingStatus;
	customerId?: string;
	technicianId?: string;
	serviceId?: string;
	page?: number;
	limit?: number;
	fromDate?: Date;
	toDate?: Date;
}) => {
	const page = filters.page ?? 1;
	const limit = filters.limit ?? 20;

	const skip = (page - 1) * limit;

	const where: Prisma.BookingWhereInput = {};

	if (filters.status) {
		where.status = filters.status;
	}

	if (filters.customerId) {
		where.customerId = filters.customerId;
	}

	if (filters.technicianId) {
		where.technicianId = filters.technicianId;
	}

	if (filters.serviceId) {
		where.serviceId = filters.serviceId;
	}

	if (filters.fromDate || filters.toDate) {
		where.bookingDate = {
			...(filters.fromDate && {
				gte: filters.fromDate,
			}),

			...(filters.toDate && {
				lte: filters.toDate,
			}),
		};
	}

	const data = await prisma.booking.findMany({
		where,
		skip,
		take: limit,
		select: {
			id: true,
			bookingDate: true,
			status: true,
			createdAt: true,

			customer: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},

			technician: {
				select: {
					id: true,
					userName: true,
					user: {
						select: {
							name: true,
						},
					},
				},
			},

			service: {
				select: {
					id: true,
					name: true,
					price: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const total = await prisma.booking.count({
		where,
	});

	return { data, metaData: { total, page, skip, limit } };
};
const getCategoryService = async () => {
	const data = await prisma.category.findMany();
	return data;
};

export const categoryService = {
	getAllUserService,
	updateUserService,
	getBookingsService,
	getCategoryService,
};
