import type { Response } from "express";

export type JwtOptionsPayload = {
	httpOnly: boolean;
	maxAge?: number;
	secure: boolean;
};

export const setCookie = (
	res: Response,
	value: string,
	Token: string,
	options: JwtOptionsPayload,
) => {
	res.cookie(value, Token, {
		httpOnly: options.httpOnly,
		maxAge: 1000 * 60 * 60 * 60 * (options.maxAge || 1),
		secure: options.secure,
	});
};
