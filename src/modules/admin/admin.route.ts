// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import authMiddleware from "../../core/middleware/authentication";
import { categoryController } from "./admin.controller";
import { validateData } from "../../core/middleware/validator.middleware";
import { createCategorySchema } from "./category.validator";
const router = Router();

router.get(
	"/categories",
	authMiddleware("ADMIN"),
	categoryController.getAllCategoryController,
);

router.post(
	"/categories",
	authMiddleware("ADMIN"),
	validateData(createCategorySchema),
	categoryController.createCategoryController,
);

export const adminRouter = router;
