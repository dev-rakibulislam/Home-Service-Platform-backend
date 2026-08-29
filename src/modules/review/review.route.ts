import { Router } from "express";
import { reviewController } from "./review.controller";
import authMiddleware from "../../core/middleware/authentication";
import { UserRole } from "../../../generated/prisma/enums";
import { validateData } from "../../core/middleware/validator.middleware";
import { createReviewSchema } from "./review.validation";

const router = Router();

// router.get("/", reviewController.getReviews);
// router.get("/:id", reviewController.getReview);
router.post(
	"/:id",
	authMiddleware(UserRole.CUSTOMER),
	validateData(createReviewSchema),
	reviewController.createReviewController,
);

export const reviewRouter = router;