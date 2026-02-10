import { ICreateCategoryResponse, ICreateCategory } from "@/schemas/category";
import Category from "./categoryModel";

export class CategoryRepository {
	public async createCategory(
		userId: string,
		payload: ICreateCategory,
	): Promise<ICreateCategoryResponse> {
		const newCategory = await Category.create({
			...payload,
			categoryAuthorId: userId,
		});

		return newCategory.toJSON();
	}

	public async getCategoryByTitle(
		userId: string,
		title: string,
	): Promise<ICreateCategoryResponse | null> {
		const category = await Category.findOne({
			where: { categoryAuthorId: userId, title: title.trim() },
		});
		return category ? category.toJSON() : null;
	}
}
