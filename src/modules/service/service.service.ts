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
            omit:{password:true,role:true,status:true}
          },
        },
      },
    },
  });
};


export const ServicesService = {
	createService,
	getAllService,getHomepageServices,getServiceDetailsServices
};
