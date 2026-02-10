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
	notesCount: z.number(),
});

export type ICategory = z.infer<typeof CategorySchema>;
export type ICreateCategoryResponse = z.infer<typeof CreateCategoryResponseSchema>;
export type ICreateCategory = z.infer<typeof CreateCategorySchema>["body"];
export type ICategoryResponse = z.infer<typeof CategoryResponseSchema>;
