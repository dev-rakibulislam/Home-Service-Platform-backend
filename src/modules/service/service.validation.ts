import z from "zod";

export const createServiceSchema = z.object({
	name: z
		.string("name is required")
		.min(6, "name must be at least 6 characters long")
		.max(32, "name must be less than 32 characters long"),

	description: z
		.string("description is required")
		.min(6, "description must be at least 6 characters long")
		.max(255, "description must be less than 255 characters long"),

	price: z.coerce
		.number("price is required")
		.positive("price must be greater than 0"),

	duration: z.coerce
		.number("duration is required")
		.int("duration must be an number")
		.positive("duration must be in minute and greater than 0"),
     categoryId: z
        .string({ message: "Category ID is required" })
        .uuid("Invalid Category ID"),
});

export type createServiceSchema = z.infer<typeof createServiceSchema>;
