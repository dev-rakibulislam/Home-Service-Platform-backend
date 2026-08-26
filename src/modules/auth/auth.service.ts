import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import type { UserRegisterPayload } from "./auth.validator";
import { generateToken } from "../../core/utils/jwt";
import { existingUser } from "../../core/utils/checkUser";
import { config } from "../../config/env";
import AppError from "../../core/error/appError";

const registerUserInDb = async (payload: UserRegisterPayload) => {
	const {address} = payload;

	// const existingUserRecord = await existingUser(email);

	// if (existingUserRecord) {
	// 	throw new AppError(409, "User already exists with this email");
	// }

	// const hashedPassword = await bcrypt.hash(
	// 	password,
	// 	Number(config.bcrypt_salt_rounds),
	// );

	// const userData = {
	// 	email,
	// 	password: hashedPassword,
	// 	firstName,
	// 	lastName,
	// 	phoneNumber,
	// 	role,
	// };

	// if (role === UserRole.TECHNICIAN) {
	// 	if (!bio || !hourlyRate || yearsOfExperience === undefined) {
	// 		throw new AppError(
	// 			400,
	// 			"Bio, hourly rate and years of experience are required for technicians",
	// 		);
	// 	}
	// 	Object.assign(userData, {
	// 		technicianProfile: {
	// 			create: {
	// 				bio,
	// 				userName: userName
	// 					? userName
	// 					: `fixitnow-${Math.ceil(Math.random() * 1000)}-${Date.now()}`,
	// 				hourlyRate,
	// 				yearsOfExperience,
	// 			},
	// 		},
	// 	});
	// }

	// const result = await prisma.user.create({
	// 	data: { ...userData },
	// 	omit: { password: true },
	// 	include: {
	// 		...(userData.role === UserRole.TECHNICIAN && { technicianProfile: true }),
	// 	},
	// });

	// const JwtPayload = {
	// 	userId: result.id,
	// 	email: result.email,
	// 	role: result.role,
	// 	status: result.status,
	// };

	// const accessToken = await generateToken(JwtPayload, {
	// 	secret: config.jwt.jwt_access_secret,
	// 	expiresIn: Number(config.jwt.jwt_access_expires_in),
	// });

	// const refreshToken = await generateToken(JwtPayload, {
	// 	secret: config.jwt.jwt_refresh_secret,
	// 	expiresIn: config.jwt.jwt_refresh_expires_in,
	// });

	// return {
	// 	result,
	// 	accessToken,
	// 	refreshToken,
	// };
};

export const authService = {
	registerUserInDb,
};
