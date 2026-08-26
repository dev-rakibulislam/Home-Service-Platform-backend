import { prisma } from "../../config/prisma";

export const existingUser = async (email: string) =>
  await prisma.user.findUnique({ where: { email } });
