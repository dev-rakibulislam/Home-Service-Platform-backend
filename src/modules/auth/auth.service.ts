// biome-ignore assist/source/organizeImports: <explanation>
import type { UserRegisterPayload } from "./auth.validator";
import { getExistingUser } from "../../core/utils/getExistingUser";
import AppError from "../../core/error/appError";
import bcrypt from "bcryptjs";
import { config } from "../../config/env";
import { prisma } from "../../config/prisma";
import { UserRole } from "../../../generated/prisma/enums";

const registerUserInDb = async (payload: UserRegisterPayload) => {
	const {
		email,
		password,
		name,
		role,
		address,
		bio,
		hourlyRate,
		phoneNumber,
		experienceYears,
		skills,
	} = payload;

	const existingUserRecord = await getExistingUser(email);

	if (existingUserRecord) {
		throw new AppError(409, "User already exists with this email");
	}

	const hashedPassword = await bcrypt.hash(
		password,
		Number(config.bcrypt_salt_rounds),
	);

	const result = await prisma.user.create({
		data: {
			email,
			address,
			password: hashedPassword,
			name,
			phoneNumber,
			role,

			...(role === "TECHNICIAN" && {
				technicianProfile: {
					create: {
						bio: bio!,
						skills: skills!,
						hourlyRate: hourlyRate!,
						experienceYears: experienceYears!,
					},
				},
			}),
		},

		omit: { password: true },
		include: {
			technicianProfile: true,
		},
	});
	console.log(result);
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
