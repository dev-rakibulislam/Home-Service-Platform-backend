import z from "zod";
import { BookingStatus, DayOfWeek } from "../../../generated/prisma/enums";

export const createAvailabilitySchema = z.object({
	dayOfWeek: z.enum(DayOfWeek),

	startTime: z
		.string()
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time. Use HH:mm"),

	endTime: z
		.string()
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time. Use HH:mm"),
});

export const updateBookingSchema = z.object({
	status: z.enum(BookingStatus),
});

export type CreateAvailabilityPayload = z.infer<
	typeof createAvailabilitySchema
>;
export type updateBookingPayload = z.infer<
	typeof updateBookingSchema
>;
