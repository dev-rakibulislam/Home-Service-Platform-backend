// biome-ignore assist/source/organizeImports: <explanation>
import type { UserLoginPayload, UserRegisterPayload } from "./auth.validator";
import { getExistingUser } from "../../core/utils/getExistingUser";
import AppError from "../../core/error/appError";
import bcrypt from "bcryptjs";
import { config } from "../../config/env";
import { prisma } from "../../config/prisma";
import { generateToken, jwtCookiePayload } from "../../core/utils/jwt";
import type { AuthenticatedUser } from "../../types/auth";

const registerUserInDb = async (payload: UserRegisterPayload) => {
	const {
		email,
		password,
		name,
		userName,
		role,
		address,
		bio,
		hourlyRate,
		phoneNumber,
		experienceYears,
		skills,
	} = payload;

	const existingUserRecord = await getExistingUser(
		{ email },
		{
			technicianProfile: true,
		},
	);
	if (existingUserRecord) {
		throw new AppError(409, "User already exists with this email");
	}

	if (role === "TECHNICIAN" && userName) {
		const existingTechnician = await prisma.technicianProfile.findUnique({
			where: { userName },
		});

		if (existingTechnician) {
			throw new AppError(409, "Username has already been taken");
		}
	}

	const hashedPassword = await bcrypt.hash(
		password,
		Number(config.bcrypt_salt_rounds),
	);

	const technicianProfileData =
		role === "TECHNICIAN"
			? {
					bio: bio ?? "",
					skills: skills ?? [],
					hourlyRate: hourlyRate ?? 0,
					experienceYears: experienceYears ?? 0,
					userName: userName ?? "",
				}
			: undefined;

	const result = await prisma.user.create({
		data: {
			email,
			address,
			password: hashedPassword,
			name,
			phoneNumber,
			role,

			...(technicianProfileData && {
				technicianProfile: {
					create: technicianProfileData,
				},
			}),
		},

		omit: { password: true },
		include: {
			technicianProfile: true,
		},
	});

	const JwtPayload = await jwtCookiePayload(result);

	const accessToken = await generateToken(JwtPayload, {
		expiresIn: config.jwt.jwt_access_expires_in!,
		secret: config.jwt.jwt_access_secret,
	});

	const refreshToken = await generateToken(JwtPayload, {
		secret: config.jwt.jwt_refresh_secret,
		expiresIn: config.jwt.jwt_refresh_expires_in!,
	});

	return {
		accessToken,
		refreshToken,
	};
};

const loginUserInDb = async (payload: UserLoginPayload) => {
	const existingUserRecord = await getExistingUser({ email: payload.email });

	if (existingUserRecord === null) {
		throw new AppError(409, "user not found. Please register");
	}
	const { password: passwordDB } = existingUserRecord;

	const isPasswordMatch = await bcrypt.compare(payload.password, passwordDB);

	if (!isPasswordMatch) {
		throw new AppError(401, "Invalid credentials");
	}
	const JwtPayload = await jwtCookiePayload(existingUserRecord);

	const accessToken = await generateToken(JwtPayload, {
		expiresIn: config.jwt.jwt_access_expires_in!,
		secret: config.jwt.jwt_access_secret,
	});

	const refreshToken = await generateToken(JwtPayload, {
		secret: config.jwt.jwt_refresh_secret,
		expiresIn: config.jwt.jwt_refresh_expires_in!,
	});

	return { accessToken, refreshToken };
};

const getProfileFromDb = async (payload: AuthenticatedUser) => {
	const getProfle = await prisma.user.findUnique({
		where: {
			...payload,
		},
		omit: { password: true },
		include: { technicianProfile: true },
	});
	return getProfle;
};

export const authService = {
	registerUserInDb,
	getProfileFromDb,
	loginUserInDb,
};
