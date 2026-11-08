import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { sendResponse } from "../../core/utils/response";
import { ServicesService } from "./service.service";
import {
  createServiceSchema,
  myServicesQuerySchema,
  updateServiceSchema,
} from "./service.validation";

const createServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const payload = createServiceSchema.parse(req.body);

    const result = await ServicesService.createService(payload, req.user!);

    sendResponse(res, {
      code: 201,
      message: "Service created successfully!",
      data: result,
    });
  },
);

const getMyServicesController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = myServicesQuerySchema.parse(req.query);

    const result = await ServicesService.getMyServices(req.user!, filters);

    sendResponse(res, {
      code: 200,
      message: "Your services retrieved successfully!",
      data: result.services,
      metaData: result.pagination,
    });
  },
);

const updateMyServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const payload = updateServiceSchema.parse(req.body);

    const result = await ServicesService.updateMyService(
      req.params.id as string,
      payload,
      req.user!,
    );

    sendResponse(res, {
      code: 200,
      message: "Service updated successfully!",
      data: result,
    });
  },
);

const deleteMyServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ServicesService.deleteMyService(
      req.params.id as string,
      req.user!,
    );

    sendResponse(res, {
      code: 200,
      message: "Service deleted successfully!",
      data: result,
    });
  },
);

const getServiceController = catchAsync(async (req: Request, res: Response) => {
  const { category, location, minRating, maxPrice, page, limit } = req.query;

  const result = await ServicesService.getAllService({
    category: category as string | undefined,
    location: location as string | undefined,
    minRating: minRating ? Number(minRating) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 6,
  });

  sendResponse(res, {
    code: 200,
    message: "all service get successfully.",
    data: result.services,
    metaData: result.pagination,
  });
});

const getHomepageServicesController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await ServicesService.getHomepageServices();
    sendResponse(res, {
      code: 200,
      message: "all service get successfully.",
      data,
    });
  },
);

const getServiceDetailsController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await ServicesService.getServiceDetailsServices(
      req.params?.id as string,
    );
    sendResponse(res, {
      code: 200,
      message: "Service Details get successfully.",
      data,
    });
  },
);

export const serviceController = {
  createServiceController,
  getServiceController,
  getHomepageServicesController,
  getServiceDetailsController,
  getMyServicesController,
  updateMyServiceController,
  deleteMyServiceController,
};
