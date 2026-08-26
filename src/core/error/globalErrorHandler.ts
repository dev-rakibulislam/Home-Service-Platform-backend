// biome-ignore assist/source/organizeImports: <explanation>
import type{ NextFunction, Request, Response } from "express";
import { config } from "../../config/env";
import { ZodError } from "zod";
import AppError from "./appError";
import { sendResponse } from "../utils/response";
import { PrismaClientValidationError } from "../../../generated/prisma/internal/prismaNamespace";
import handleZodError from "./handleZodError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { handlePrismaError } from "./handlePrismaError";

const globalErrorHandler = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	config.node_env === "DEVELOPMENT" && console.error(error);

	if (error instanceof ZodError) {
		const { statusCode, errors, message } = handleZodError(error);
		return sendResponse(res, {
			code: statusCode,
			message: message,
			errorDetails: errors,
		});
	}

	if (error instanceof AppError) {
		return sendResponse(res, {
			code: error.statusCode,
			message: error.message,
			errorDetails: error?.errorDetails,
		});
	}

	if (error.type === "entity.parse.failed") {
		return sendResponse(res, {
			code: error.statusCode,
			message: error.message,
			errorDetails: "Invalid JSON format",
		});
	}

	if (error instanceof PrismaClientKnownRequestError) {
		const simplifiedError = handlePrismaError(error);

		return sendResponse(res, {
			code: simplifiedError.statusCode,
			message: simplifiedError.message,
			errorDetails: simplifiedError.errors,
		});
	}

	if (error instanceof PrismaClientValidationError) {
  return sendResponse(res, {
    code: 400,
    message: "Database validation error",
    errorDetails: [
      {
        path: "database",
        message: error.message,
      },
    ],
  });
}

	sendResponse(res, {
		code: 500,
		errorDetails: error,
		message: "Something went wrong",
	});
};

export default globalErrorHandler;
