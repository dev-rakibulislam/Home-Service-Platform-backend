import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", reviewController.createReview);
router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReview);
router.patch("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export const reviewRouter = router;
