import z from "zod";

export const createPaymentSchema = z.object({
	bookingId: z.string().uuid("Invalid booking ID"),

	provider: z.enum(["STRIPE", "SSLCOMMERZ"]),
});

export type CreatePaymentPayload = z.infer<
	typeof createPaymentSchema
>;