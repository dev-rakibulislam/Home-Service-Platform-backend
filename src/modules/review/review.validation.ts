import { z } from "zod";

export const createReviewSchema = z.object({
	rating: z
		.number()
		.int("Rating must be an integer")
		.min(1, "Rating must be at least 1")
		.max(5, "Rating must be at most 5"),
	comment: z
		.string()
		.min(1, "Comment is required")
		.max(255, "Comment cannot exceed 255 characters"),
});

export type CreateReviewPayload = z.infer<typeof createReviewSchema>;
