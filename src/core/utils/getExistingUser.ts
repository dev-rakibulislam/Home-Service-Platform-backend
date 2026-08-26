import { prisma } from "../../config/prisma";

export type getExistingUserType = { email?: string; id?: string };

export const getExistingUser = async (data: getExistingUserType) => {
	const orClauses = [];

	if (data.email) {
		orClauses.push({
			email: data.email,
		});
	}

	if (data.id) {
		orClauses.push({
			id: data.id,
		});
	}

	return prisma.user.findFirst({
		where: {
			OR: orClauses,
		},
	});
};
