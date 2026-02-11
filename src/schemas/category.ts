import { commonValidations } from "@/common/utils/commonValidation";
import { z } from "zod";

export const CategorySchema = z.object({
	title: z.string().trim().min(1, "Category title is required"),
	emoji: z.string().trim().optional(),
});

export const CreateCategoryResponseSchema = CategorySchema.extend({
	id: z.string(),
	categoryAuthorId: z.string().trim().min(1, "Category authord ID is required"),
});

export const CreateCategorySchema = z.object({
	body: CategorySchema,
});

export const CategoryResponseSchema = CreateCategoryResponseSchema.extend({
	notesCount: z.number().optional(),
});

export const CategoriesResponseSchema = z.array(CategoryResponseSchema);

export const GetCategorySchema = z.object({
	params: z.object({ categoryId: commonValidations.id }),
});

export const UpdateCategorySchema = z.object({
	body: CategorySchema.partial(),
});

export type ICategory = z.infer<typeof CategorySchema>;
export type ICreateCategoryResponse = z.infer<typeof CreateCategoryResponseSchema>;
export type ICreateCategory = z.infer<typeof CreateCategorySchema>["body"];
export type ICategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type ICategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
export type IGetCategory = z.infer<typeof GetCategorySchema>["params"];
export type IUpdateCategory = z.infer<typeof UpdateCategorySchema>["body"];
