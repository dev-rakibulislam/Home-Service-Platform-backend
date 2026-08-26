import jwt, { type SignOptions } from "jsonwebtoken";
import type { TJwtData, TJwtPayload } from "../../types/jwt";
import type { User } from "../../../generated/prisma/client";

export const generateToken = async (payload: TJwtPayload, data: TJwtData) => {
	return jwt.sign(payload, data.secret, {
		expiresIn: data.expiresIn as SignOptions["expiresIn"],
	});
};

export const verifyAccessToken = (token: string, secret: string) => {
	return jwt.verify(token, secret) as TJwtPayload;
};

export async function jwtCookiePayload(
	result: Pick<User, "id" | "email" | "role" | "status">,
) {
	return {
		userId: result.id,
		email: result.email,
		role: result.role,
		status: result.status,
	};
}
