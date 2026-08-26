import { prisma } from "../../config/prisma";

export const getExistingUser = async (email: string) =>
	await prisma.user.findUnique({ where: { email } });
