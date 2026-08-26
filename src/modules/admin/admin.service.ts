import type { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import { getExistingUser } from "../../core/utils/getExistingUser";

const getAllUserService = async () => {
	const result = await prisma.user.findMany({
		include: { technicianProfile: true },
	});
	return result;
};

const updateUserService = async (id: string, status: UserStatus) => {
	const data = await getExistingUser({ id });
	if (data === null) {
		throw new AppError(404, "user Not found");
	}
	const result = await prisma.user.update({
		where: { id },
		data: { status },
	});
	return result;
};

export const categoryService = {
	getAllUserService,
	updateUserService,
};
