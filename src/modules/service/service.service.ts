import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import type { AuthenticatedUser } from "../../types/auth";
import type {
  createServiceSchema,
  UpdateServicePayload,
} from "./service.validation";

const createService = async (
  payload: createServiceSchema,
  userData: AuthenticatedUser,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId: userData.id,
    },
    select: {
      id: true,
    },
  });

  if (!technician) {
    throw new AppError(404, "Technician profile not found!");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category?.isActive) {
    throw new AppError(404, "Active category not found!");
  }

  const result = await prisma.service.create({
    data: {
      ...payload,
      technicianId: technician.id,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const getAllService = async (filters: {
  category?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}) => {
  const {
    category,
    location,
    minRating,
    maxPrice,
    page = 1,
    limit = 6,
  } = filters;

  const where: Prisma.ServiceWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = {
      is: {
        name: {
          contains: category,
          mode: "insensitive",
        },
      },
    };
  }

  if (maxPrice !== undefined) {
    where.price = { lte: maxPrice };
  }

  const technicianProfile: Prisma.TechnicianProfileWhereInput = {};

  if (location) {
    technicianProfile.OR = [
      {
        user: {
          address: {
            contains: location,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  if (minRating !== undefined) {
    technicianProfile.avgRating = { gte: minRating };
  }

  if (location || minRating !== undefined) {
    where.technician = technicianProfile;
  }

  const skip = (page - 1) * limit;

  const [services, total] = await prisma.$transaction([
    prisma.service.findMany({
      where,
      include: {
        category: true,
        technician: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.service.count({ where }),
  ]);

  return {
    services,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getHomepageServices = async () => {
  return await prisma.service.findMany({
    where: {
      isActive: true,
      technician: {
        avgRating: { gte: 4.1 },
        isAvailable: true,
        status: "ACTIVE",
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
      category: {
        select: {
          name: true,
        },
      },
      technician: {
        select: {
          userName: true,
          avgRating: true,
          experienceYears: true,
          isAvailable: true,
        },
      },
    },
    take: 6,
  });
};

const getAllServices = async (query: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    categoryId,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const whereCondition = {
    isActive: true,

    technician: {
      avgRating: { gte: 4.1 },
      isAvailable: true,
      status: "ACTIVE" as const,
    },

    ...(categoryId && { categoryId }),

    ...(searchTerm && {
      name: {
        contains: searchTerm,
        mode: "insensitive" as const,
      },
    }),
  };

  const [services, total] = await prisma.$transaction([
    prisma.service.findMany({
      where: whereCondition,

      select: {
        id: true,
        name: true,
        price: true,
        duration: true,

        category: {
          select: {
            id: true,
            name: true,
          },
        },

        technician: {
          select: {
            userName: true,
            avgRating: true,
            experienceYears: true,
            isAvailable: true,
          },
        },
      },

      orderBy: {
        [sortBy]: sortOrder,
      },

      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.service.count({
      where: whereCondition,
    }),
  ]);

  return {
    data: services,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getServiceDetailsServices = async (id: string) => {
  return prisma.service.findUnique({
    where: {
      id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
      description: true,
      category: {
        select: {
          name: true,
        },
      },
      technician: {
        select: {
          availabilitySlots: true,
          skills: true,
          // services: true,
          hourlyRate: true,
          userName: true,
          avgRating: true,
          experienceYears: true,
          isAvailable: true,
          user: {
            omit: { password: true, role: true, status: true },
          },
        },
      },
    },
  });
};

//* update
// 2. GET MY SERVICES
const getMyServices = async (
  userData: AuthenticatedUser,
  filters: {
    page?: number;
    limit?: number;
  },
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId: userData.id,
    },
    select: {
      id: true,
    },
  });

  if (!technician) {
    throw new AppError(404, "Technician profile not found!");
  }

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 10));

  const skip = (page - 1) * limit;

  const where: Prisma.ServiceWhereInput = {
    technicianId: technician.id,
  };

  const [services, total] = await prisma.$transaction([
    prisma.service.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.service.count({
      where,
    }),
  ]);

  return {
    services,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// 3. UPDATE MY SERVICE
const updateMyService = async (
  serviceId: string,
  payload: UpdateServicePayload,
  userData: AuthenticatedUser,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId: userData.id,
    },
    select: {
      id: true,
    },
  });

  if (!technician) {
    throw new AppError(404, "Technician profile not found!");
  }

  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      technicianId: technician.id,
    },
  });

  if (!service) {
    throw new AppError(404, "Service not found!");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!category?.isActive) {
      throw new AppError(404, "Active category not found!");
    }
  }

  const result = await prisma.service.update({
    where: {
      id: service.id,
    },
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};

// 4. DELETE MY SERVICE
const deleteMyService = async (
  serviceId: string,
  userData: AuthenticatedUser,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId: userData.id,
    },
    select: {
      id: true,
    },
  });

  if (!technician) {
    throw new AppError(404, "Technician profile not found!");
  }

  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      technicianId: technician.id,
    },
    select: {
      id: true,
    },
  });

  if (!service) {
    throw new AppError(404, "Service not found!");
  }

  const bookingCount = await prisma.booking.count({
    where: {
      serviceId: service.id,
    },
  });

  // Preserve booking history if bookings exist.
  if (bookingCount > 0) {
    return prisma.service.update({
      where: {
        id: service.id,
      },
      data: {
        isActive: false,
      },
    });
  }

  return prisma.service.delete({
    where: {
      id: service.id,
    },
  });
};

export const ServicesService = {
  createService,
  getAllService,
  getHomepageServices,
  getServiceDetailsServices,
  deleteMyService,
  updateMyService,
  getMyServices,getAllServices
};
