import jwt, { type SignOptions } from "jsonwebtoken";
import type { TJwtData, TJwtPayload } from "../../types/jwt";
import type { User } from "../../../generated/prisma/client";

export const generateToken = async (payload: TJwtPayload, data: TJwtData) => {
	return jwt.sign(payload, data.secret, {
		expiresIn: data.expiresIn as SignOptions["expiresIn"],
	});
};

export const verifyToken = (token: string, secret: string) => {
	try {
		const verifiedToken = jwt.verify(token, secret) as TJwtPayload;
		return {
			success: true,
			data: verifiedToken,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
		};
	}
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
