import z from "zod";

export const createCategorySchema = z.object({
	name: z
		.string("name is required")
		.min(6, "name must be at least 6 characters long")
		.max(32, "name must be less than 32 characters long"),

	description: z
		.string("description is required")
		.min(6, "description must be at least 6 characters long")
		.max(255, "description must be less than 255 characters long"),
});

export type CreateCategoryPayload  = z.infer<typeof createCategorySchema>;
