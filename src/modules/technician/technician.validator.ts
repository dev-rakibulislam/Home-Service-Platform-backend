import z from "zod";
import { DayOfWeek } from "../../../generated/prisma/enums";

export const createAvailabilitySchema = z.object({
	dayOfWeek: z.enum(DayOfWeek),

	startTime: z
		.string()
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time. Use HH:mm"),

	endTime: z
		.string()
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time. Use HH:mm"),
});

export type CreateAvailabilityPayload = z.infer<
	typeof createAvailabilitySchema
>;
