// biome-ignore assist/source/organizeImports: <explanation>
import type { Request, Response } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../core/utils/response";

const registerUserController = catchAsync(
	async (req: Request, res: Response) => {
		const result = await authService.registerUserInDb(req.body);
		console.log(result);
		// setCookie(res, "accessToken", accessToken, {
		//   httpOnly: true,
		//   maxAge: 24,
		//   secure: config.node_env === "PRODUCTION",
		// });

		// setCookie(res, "refreshToken", refreshToken, {
		//   httpOnly: true,
		//   secure: config.node_env === "PRODUCTION",
		//   maxAge: 14,
		// });

		sendResponse(res, {
			code: 201,
			message: "User registered successfully",
			data: result,
		});
	},
);

export const authController = {
	registerUserController
};
