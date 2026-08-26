import { DayOfWeek } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import type { AuthenticatedUser } from "../../types/auth";
import type { CreateBookingPayload } from "./booking.validator";

const createAvailabilityService = async (
	payload: CreateBookingPayload,
	userData: AuthenticatedUser,
) => {
	const service = await prisma.service.findUnique({
		where: {
			id: payload.serviceId,
		},
	});

	if (!service) {
		throw new AppError(404, "Service not found");
	}

	const date = new Date(`${payload.bookingDate}T00:00:00`);

	const days = [
		DayOfWeek.SUNDAY,
		DayOfWeek.MONDAY,
		DayOfWeek.TUESDAY,
		DayOfWeek.WEDNESDAY,
		DayOfWeek.THURSDAY,
		DayOfWeek.FRIDAY,
		DayOfWeek.SATURDAY,
	];

	const dayOfWeek = days[date.getDay()];

	const availability = await prisma.availabilitySlot.findFirst({
		where: {
			technicianId: service.technicianId,
			dayOfWeek,
			startTime: {
				lte: payload.bookingTime,
			},
			endTime: {
				gte: payload.bookingTime,
			},
		},
	});

	if (!availability) {
		throw new AppError(400, "Technician is not available at this time");
	}

	const bookingDate = new Date(
		`${payload.bookingDate}T${payload.bookingTime}:00`,
	);

	const existingBooking = await prisma.booking.findFirst({
		where: {
			technicianId: service.technicianId,
			bookingDate,
			status: {
				in: ["PENDING", "ACCEPTED", "IN_PROGRESS"],
			},
		},
	});

	if (existingBooking) {
		throw new AppError(409, "Technician is already booked at this time");
	}

	// Booking create
	const result = await prisma.booking.create({
		data: {
			customerId: userData.id,
			technicianId: service.technicianId,
			serviceId: service.id,
			bookingDate,
		},
	});

	return result;
};
export const bookingService = {
	createAvailabilityService,
};
