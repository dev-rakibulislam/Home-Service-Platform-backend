// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import authMiddleware from "../../core/middleware/authentication";
import { createCategorySchema } from "./category.validator";
import { validateData } from "../../core/middleware/validator.middleware";
import { categoryController } from "./category.controller";
const router = Router();


router.get(
	"/",
	authMiddleware("ADMIN"),
	categoryController.getAllCategoryController,
);

router.post(
	"/",
	authMiddleware("ADMIN"),
	validateData(createCategorySchema),
	categoryController.createCategoryController,
);

export const categoryRouter = router;
