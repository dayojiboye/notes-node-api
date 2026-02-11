import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import apiBaseUrl from "@/config/apiBaseUrl";
import {
	CreateCategoryResponseSchema,
	CreateCategorySchema,
	CategoryResponseSchema,
	CategoriesResponseSchema,
	UpdateCategorySchema,
	GetCategorySchema,
} from "@/schemas/category";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { categoryController } from "./categoryController";

export const categoryRegistry = new OpenAPIRegistry();
export const categoryRouter: Router = express.Router();

categoryRegistry.register("Category", CategoryResponseSchema);

categoryRegistry.registerPath({
	method: "post",
	path: `${apiBaseUrl}/category`,
	tags: ["Category Service"],
	summary: "Create a category",
	request: {
		body: {
			content: {
				"application/json": {
					schema: CreateCategorySchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(CreateCategoryResponseSchema, "Success"),
});

categoryRouter.post("/", validateRequest(CreateCategorySchema), categoryController.createCategory);

categoryRegistry.registerPath({
	method: "get",
	path: `${apiBaseUrl}/category`,
	tags: ["Category Service"],
	summary: "Get user's categories",
	responses: createApiResponse(CategoriesResponseSchema, "Success"),
});

categoryRouter.get("/", categoryController.getAllCategories);

categoryRegistry.registerPath({
	method: "patch",
	path: `${apiBaseUrl}/category/{categoryId}`,
	tags: ["Category Service"],
	summary: "Update category",
	request: {
		params: GetCategorySchema.shape.params,
		body: {
			content: {
				"application/json": {
					schema: UpdateCategorySchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(CategoryResponseSchema, "Success"),
});

categoryRouter.patch(
	"/:categoryId",
	validateRequest(UpdateCategorySchema),
	categoryController.updateCategory,
);
