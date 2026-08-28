import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../config/prisma";

export type getExistingUserType = { email?: string; id?: string };

export const getExistingUser = async (
	payload: getExistingUserType,
	include?: Prisma.UserInclude,
) => {
	const orClauses = [];

	if (payload.email) {
		orClauses.push({
			email: payload.email,
		});
	}
	if (payload.id) {
		orClauses.push({
			id: payload.id,
		});
	}
	const where = orClauses.length ? { OR: orClauses } : { id: "" };

	return await prisma.user.findFirst({
		where,
		...(include && { include }),
	});
};
