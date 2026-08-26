import type { NextFunction, Request, Response } from "express";
import type z from "zod";

export const validateData = <T extends z.ZodType>(schema: T) => {
	return (req: Request, _: Response, next: NextFunction) => {
		const { success, data, error } = schema.safeParse(req.body);
		if (!success) {
			return next(error);
		}
		req.body = data;
		next();
	};
};
