// biome-ignore assist/source/organizeImports: <explanation>
import { UserRole } from "../generated/prisma/enums";
import bcrypt from "bcryptjs";
import { config } from "./config/env";
import { prisma } from "./config/prisma";
import AppError from "./core/error/appError";
import boxen from "boxen";
import pc from "picocolors";

const printSeededUser = (
	role: string,
	name: string,
	email: string,
	success = false,
) => {
	const title = `DEFAULT ${role} ${success ? "SEEDED" : "EXIST"}`;

	const statusColor = success ? pc.green : pc.red;

	console.log(
		boxen(
			`${statusColor(title)}\n` +
				`${"─".repeat(title.length)}\n\n` +
				`Name  : ${name}\n` +
				`Email : ${email}\n` +
				`Role  : ${role}`,
			{
				padding: 1,
				borderStyle: "round",
			},
		),
	);
};

const seedIntoDB = async () => {
	const { seed } = config;
	const { admin, customer, technician } = seed;

	if (
		!admin.defaultAdminEmail ||
		!admin.defaultAdminName ||
		!admin.defaultAdminPassword ||
		!customer.defaultCustomerEmail ||
		!customer.defaultCustomerName ||
		!customer.defaultCustomerPassword ||
		!technician.defaultTechnicianEmail ||
		!technician.defaultTechnicianPassword ||
		!technician.defaultTechnicianName
	) {
		throw new AppError(
			404,
			"admin, technician or customer credentials not found",
		);
	}

	const findAdminInDB = await prisma.user.findFirst({
		where: {
			role: UserRole.ADMIN,
		},
	});

	if (!findAdminInDB) {
		const hashedPassword = await bcrypt.hash(
			admin.defaultAdminPassword,
			Number(config.bcrypt_salt_rounds),
		);
		const { name, email, role } = await prisma.user.create({
			data: {
				email: admin.defaultAdminEmail,
				name: admin.defaultAdminName,
				password: hashedPassword,
				role: UserRole.ADMIN,
			},
			select: {
				email: true,
				name: true,
				role: true,
			},
		});
		printSeededUser(name, email, role, true);
	}

	const findTechnicianInDB = await prisma.user.findFirst({
		where: {
			role: UserRole.TECHNICIAN,
		},
	});

	if (!findTechnicianInDB) {
		const hashedPassword = await bcrypt.hash(
			technician.defaultTechnicianPassword,
			Number(config.bcrypt_salt_rounds),
		);

		const { name, email, role } = await prisma.user.create({
			data: {
				email: technician.defaultTechnicianEmail,
				name: technician.defaultTechnicianName,
				password: hashedPassword,
				role: UserRole.TECHNICIAN,
				technicianProfile: {
					create: {
						userName: "rakib-tech",
						bio: "hi iam technician please book a service",
						experienceYears: 5,
						hourlyRate: 120,
					},
				},
			},
			select: {
				email: true,
				name: true,
				role: true,
			},
		});
		printSeededUser(name, email, role, true);
	}

	const findCustomerInDB = await prisma.user.findFirst({
		where: {
			role: UserRole.CUSTOMER,
		},
	});

	if (!findCustomerInDB) {
		const hashedPassword = await bcrypt.hash(
			customer.defaultCustomerPassword,
			Number(config.bcrypt_salt_rounds),
		);
		const { name, email, role } = await prisma.user.create({
			data: {
				email: customer.defaultCustomerEmail,
				name: customer.defaultCustomerName,
				password: hashedPassword,
				role: UserRole.CUSTOMER,
			},

			select: {
				email: true,
				name: true,
				role: true,
			},
		});
		printSeededUser(name, email, role, true);
	}

	if (findTechnicianInDB) {
		printSeededUser(
			findTechnicianInDB.role,
			findTechnicianInDB.name,
			findTechnicianInDB.email,
			false,
		);
	}
	if (findCustomerInDB) {
		printSeededUser(
			findCustomerInDB.role,
			findCustomerInDB.name,
			findCustomerInDB.email,
			false,
		);
	}
	if (findAdminInDB) {
		printSeededUser(
			findAdminInDB.role,
			findAdminInDB.name,
			findAdminInDB.email,
			false,
		);
	}
};

export default seedIntoDB;
