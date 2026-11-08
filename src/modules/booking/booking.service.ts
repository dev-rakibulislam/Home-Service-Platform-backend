import { BookingStatus, DayOfWeek } from "../../../generated/prisma/enums";
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
import { Prisma } from "../../../generated/prisma/client";

type GetMyBookingsParams = {
  page?: number;
  limit?: number;
  status?: string;
  sortOrder?: string;
};

const getMyBookingService = async (
  user: AuthenticatedUser,
  params: GetMyBookingsParams,
) => {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 10));

  const skip = (page - 1) * limit;

  const sortOrder =
    params.sortOrder === "asc" ? "asc" : "desc";

  const allowedStatuses = [
    "PENDING",
    "ACCEPTED",
    "REJECTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  if (
    params.status &&
    !allowedStatuses.includes(params.status)
  ) {
    throw new AppError(400, "Invalid booking status");
  }

  const where: Prisma.BookingWhereInput = {
    customerId: user.id,
    ...(params.status && {
      status: params.status as Prisma.BookingWhereInput["status"],
    }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: sortOrder,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        technician: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                address: true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),

    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    metaData: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};

const getSingleBookingService = async (id: string) => {
  const data = await prisma.booking.findUnique({
    where: { id },
    include: { technician: { include: { availabilitySlots: true } }},
  });
  if (!data) {
    throw new AppError(400, "booking not found");
  }
  return data;
};

const getMyRecentBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId: userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 5,

    select: {
      id: true,
      bookingDate: true,
      status: true,
      service: {
        select: {
          id: true,
          name: true,
          price:true,
        },
      },

      technician: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    bookingDate: booking.bookingDate,
    status: booking.status,
    price: booking.service.price,
    service: booking.service,
    technician: {
      id: booking.technician.user.id,
      name: booking.technician.user.name,
    },
  }));
};

const cancelBookingService = async (id: string) => {
  const data = await prisma.booking.findUnique({
    where: { id },
  });
  if (!data) {
    throw new AppError(400, "Booking not found");
  }
  if (data.status === BookingStatus.IN_PROGRESS) {
    throw new AppError(
      400,
      "Cannot cancel a booking that is already in progress",
    );
  }
  if (data.status === BookingStatus.COMPLETED) {
    throw new AppError(400, "Cannot cancel a completed booking");
  }

  return data;
};

export const bookingService = {
  createAvailabilityService,
  getMyBookingService,
  getSingleBookingService,
  cancelBookingService,
  getMyRecentBookings,
};
