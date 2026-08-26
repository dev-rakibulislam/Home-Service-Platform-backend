// biome-ignore assist/source/organizeImports: <explanation>
import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../core/utils/response";
import { setCookie } from "../../core/utils/setCookie";
import { config } from "../../config/env";

const registerUserController = catchAsync(
	async (req: Request, res: Response) => {
		const { accessToken, refreshToken } = await authService.registerUserInDb(
			req.body,
		);
		setCookie(res, "accessToken", accessToken, {
			httpOnly: true,
			secure: config.node_env === "PRODUCTION",
		});

		setCookie(res, "refreshToken", refreshToken, {
			httpOnly: true,
			secure: config.node_env === "PRODUCTION",
			maxAge: 30,
		});

		sendResponse(res, {
			code: 201,
			message: "User registered successfully.",
		});
	},
);

const loginUserController = catchAsync(async (req: Request, res: Response) => {
	const { accessToken, refreshToken } = await authService.loginUserInDb(
		req.body,
	);

	setCookie(res, "accessToken", accessToken, {
		httpOnly: true,
		secure: config.node_env === "PRODUCTION",
	});

	setCookie(res, "refreshToken", refreshToken, {
		httpOnly: true,
		secure: config.node_env === "PRODUCTION",
		maxAge: 30,
	});

	sendResponse(res, {
		code: 201,
		message: "User login successfully.",
	});
});

export const authController = {
	registerUserController,
	loginUserController,
};
