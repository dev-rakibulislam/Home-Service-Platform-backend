import type { Response } from "express";

export type JwtOptionsPayload = {
	httpOnly: boolean;
	maxAge?: number;
  secure: boolean;
  sameSite: "strict" | "lax" | "none",

};

export const setCookie = (
	res: Response,
	value: string,
  Token: string,
	options: JwtOptionsPayload,
) => {
	res.cookie(value, Token, {
		httpOnly: options.httpOnly,
    maxAge: 24 * 60 * 60 * 1000 * (options.maxAge || 1),
    secure: options.secure,
    sameSite: options.sameSite
	});
};
