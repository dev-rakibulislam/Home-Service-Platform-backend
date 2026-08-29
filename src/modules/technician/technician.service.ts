import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import type { AuthenticatedUser } from "../../types/auth";
import { technicianProfileUpdateSchemaPayload } from "../auth/auth.validator";
import type { CreateAvailabilityPayload } from "./technician.validator";

const createAvailabilityService = async (
	payload: CreateAvailabilityPayload,
	userData: AuthenticatedUser,
) => {
	const technician = await prisma.technicianProfile.findUnique({
		where: {
			userId: userData.id,
		},
	});

	if (!technician) {
		throw new AppError(404, "Technician profile not found");
	}

	if (payload.startTime >= payload.endTime) {
		throw new AppError(400, "End time must be greater than start time");
	}

	const existingSlots = await prisma.availabilitySlot.findMany({
		where: {
			technicianId: technician.id,
			dayOfWeek: payload.dayOfWeek,
		},
	});

	const isOverlapping = existingSlots.some((slot) => {
		return payload.startTime < slot.endTime && payload.endTime > slot.startTime;
	});

	if (isOverlapping) {
		throw new AppError(409, "This time slot overlaps with an existing slot");
	}

	const result = await prisma.availabilitySlot.create({
		data: {
			technicianId: technician.id,
			dayOfWeek: payload.dayOfWeek,
			startTime: payload.startTime,
			endTime: payload.endTime,
		},
	});

	return result;
};

const getAvailableTechnicianService = async () => {
	const data = await prisma.technicianProfile.findMany({
		where: {
			isAvailable: true,
		},
		omit: { createdAt: true, updatedAt: true, isAvailable: true },
	});
	return data;
};
const getAvailableTechnicianDetailsService = async (id: string) => {
	const data = await prisma.technicianProfile.findUnique({
		where: { id },
		omit: { createdAt: true, updatedAt: true },
		include: {
			services: {
				omit: { createdAt: true, updatedAt: true },
			},
		},
	});
	if (!data) {
		throw new AppError(404, `technician not found with this id: ${id}`);
	}
	return data;
};

const updateMyProfileService = async (
	data: technicianProfileUpdateSchemaPayload,
	user: AuthenticatedUser,
) => {
	const { bio, experienceYears, hourlyRate, skills } = data;
	const result = await prisma.technicianProfile.update({
		where: { userId: user.id },
		data: {
			bio,
			experienceYears,
			hourlyRate,
			skills,
		},
	});
	return result;
};

export const technicianService = {
	createAvailabilityService,
	getAvailableTechnicianService,
	getAvailableTechnicianDetailsService,
	updateMyProfileService,
};
