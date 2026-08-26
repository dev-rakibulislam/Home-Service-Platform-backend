import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/response";
import { config } from "../../config/env";
import { prisma } from "../../config/prisma";
import AppError from "../error/appError";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const authMiddleware = (...requiredRoles: UserRole[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const authorizationHeader = req.headers.authorization;
		const token = authorizationHeader
			? authorizationHeader.startsWith("Bearer ")
				? authorizationHeader.split(" ")[1]
				: authorizationHeader
			: req.cookies.accessToken;

		if (!token) {
			return sendResponse(res, {
				code: 401,
				message: "Unauthorized",
			});
		}

		const { success, data, error } = verifyToken(
			token,
			config.jwt.jwt_access_secret,
		);

		if (!success) {
			throw new Error(error);
		}
		const { userId, email, role, status } = data as JwtPayload;

		if (!userId) {
			throw new AppError(404, "user Id missing");
		}

		if (requiredRoles && !requiredRoles.includes(role)) {
			throw new AppError(
				403,
				"Forbidden. You don't have permission to access this resource.",
			);
		}

		const authenticatedUser = await prisma.user.findUnique({
			where: {
				id: userId,
				email,
			},
			select: {
				id: true,
				email: true,
				role: true,
				status: true,
				name: true,
			},
		});

		if (!authenticatedUser) {
			throw new AppError(
				401,
				"Authentication failed! Please log in again to continue",
			);
		}

		if (authenticatedUser.status !== status) {
			throw new AppError(403, "Account status not Match. Try login again.");
		}
		if (authenticatedUser.status === UserStatus.BAN) {
			throw new AppError(403, "Account is not active. Please contact support.");
		}

		req.user = authenticatedUser;

		next();
	});
};

export default authMiddleware;
