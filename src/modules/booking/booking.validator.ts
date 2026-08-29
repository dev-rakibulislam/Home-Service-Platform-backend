import z from "zod";

export const CreateBookingSchema = z.object({
	serviceId: z.string(),

	bookingDate: z.string().date("Invalid booking date"),

	bookingTime: z
		.string()
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time. Use HH:mm"),
});

export const getBookingSchema = z.object({
	serviceId: z.string()
});

export type CreateBookingPayload = z.infer<typeof CreateBookingSchema>;
export type getBookingPayload = z.infer<typeof getBookingSchema>;
