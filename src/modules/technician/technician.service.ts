import type { Prisma } from "../../../generated/prisma/client";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import type { AuthenticatedUser } from "../../types/auth";
import type { technicianProfileUpdateSchemaPayload } from "../auth/auth.validator";
import type {
	CreateAvailabilityPayload,
	updateBookingPayload,
} from "./technician.validator";

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
    throw new AppError(
      400,
      "End time must be greater than start time",
    );
  }

  return prisma.$transaction(async (tx) => {
    const existingSlots = await tx.availabilitySlot.findMany({
      where: {
        technicianId: technician.id,
        dayOfWeek: payload.dayOfWeek,
      },
    });

    const isOverlapping = existingSlots.some(
      (slot) =>
        payload.startTime < slot.endTime &&
        payload.endTime > slot.startTime,
    );

    if (isOverlapping) {
      throw new AppError(
        409,
        "This time slot overlaps with an existing slot",
      );
    }

    return tx.availabilitySlot.create({
      data: {
        technicianId: technician.id,
        dayOfWeek: payload.dayOfWeek,
        startTime: payload.startTime,
        endTime: payload.endTime,
      },
    });
  });
};

const getMyAvailabilityService = async (userData: AuthenticatedUser) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {

      userId: userData.id,
    },
  });

  if (!technician) {
    throw new AppError(404, "Technician profile not found");
  }

  const result = await prisma.availabilitySlot.findMany({
    where: {
      technicianId: technician.id,
    },
    orderBy: [
      {
        dayOfWeek: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  return result;
};

const deleteAvailabilityService = async (
  availabilityId: string,
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

  const result = await prisma.availabilitySlot.deleteMany({
    where: {
      id: availabilityId,
      technicianId: technician.id,
    },
  });

  if (result.count === 0) {
    throw new AppError(404, "Availability slot not found");
  }

  return {
    id: availabilityId,
  };
};

const getMyBookingsService = async (userData: AuthenticatedUser) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: userData.id },
    select: { id: true },
  });

  if (!technician) {
    throw new AppError(404, "Technician profile not found");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      technicianId: technician.id,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
          image: true,
        },
      },
      service: true,
    },
    orderBy: [{ bookingDate: "desc" }, { createdAt: "desc" }],
  });

  return bookings;
};


const getAvailableTechnicianService = async (filters: {
	location?: string;
	minRating?: number;
	maxRate?: number;
	minExperience?: number;
}) => {
	const where: Prisma.TechnicianProfileWhereInput = {
		isAvailable: true,
	};

	if (filters.minRating !== undefined) {
		where.avgRating = {
			gte: filters.minRating,
		};
	}
	if (filters.maxRate !== undefined) {
		where.hourlyRate = {
			lte: filters.maxRate,
		};
	}

	if (filters.minExperience !== undefined) {
		where.experienceYears = {
			gte: filters.minExperience,
		};
	}

	if (filters.location) {
		where.user = {
			is: {
				address: {
					contains: filters.location,
					mode: "insensitive",
				},
			},
		};
	}

	const data = await prisma.technicianProfile.findMany({
		where,
		include: { user: { select: { name: true, address: true, email: true } } },

		omit: {
			createdAt: true,
			updatedAt: true,
			isAvailable: true,

		},
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

const getPendingBookingService = async (user: AuthenticatedUser) => {

	const data = await prisma.booking.findMany({
		where: {
			status: BookingStatus.PENDING,
		},
	});
	if (!data) {
		throw new AppError(400, "Pending Booking not found");
	}
	return data;
};

const getUpdatePendingBookingService = async (
  id: string,
  payload: updateBookingPayload,
  userData: AuthenticatedUser,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: userData.id },
    select: { id: true },
  });

  if (!technician) {
    throw new AppError(404, "Technician profile not found");
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      id,
      technicianId: technician.id,
    },
  });

  if (!existingBooking) {
    throw new AppError(404, "Booking not found");
  }

  if (existingBooking.status !== BookingStatus.PENDING) {
    throw new AppError(400, "Only pending bookings can be updated");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      status: payload.status,
    },
  });

  return updatedBooking;
};


export const technicianService = {
  createAvailabilityService,
  getAvailableTechnicianService,
  getAvailableTechnicianDetailsService,
  updateMyProfileService,
  getPendingBookingService,
  getUpdatePendingBookingService,
  deleteAvailabilityService,
  getMyAvailabilityService,
  getMyBookingsService,
};
