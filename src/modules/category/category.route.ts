// biome-ignore assist/source/organizeImports: <explanation>
import { Router } from "express";
import authMiddleware from "../../core/middleware/authentication";
import { createCategorySchema } from "./category.validator";
import { validateData } from "../../core/middleware/validator.middleware";
import { categoryController } from "./category.controller";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();


router.get(
	"/",
	categoryController.getAllCategoryController,
);

router.post(
	"/",
	authMiddleware(UserRole.ADMIN),
	validateData(createCategorySchema),
	categoryController.createCategoryController,
);

export const categoryRouter = router;
