import z from "zod";
import { UserStatus } from "../../../generated/prisma/enums";

export const userStatusSchema = z.object({
	status: z.enum(UserStatus),
});

export type UserStatusPayload = z.infer<typeof userStatusSchema>;
