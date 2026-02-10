import {
	ICreateCategoryResponse,
	ICreateCategory,
	ICategoryResponse,
	ICategoriesResponse,
} from "@/schemas/category";
import Category from "./categoryModel";
import sequelize from "@/config/dbconfig";

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
	): Promise<ICategoryResponse | null> {
		const category = await Category.findOne({
			where: { categoryAuthorId: userId, title: title.trim() },
		});
		return category ? category.toJSON() : null;
	}

	public async getAllCategories(userId: string): Promise<ICategoriesResponse> {
		const categories = await Category.findAll({
			where: { categoryAuthorId: userId },
			attributes: {
				include: [
					[
						sequelize.literal("(SELECT COUNT(*) FROM Notes WHERE Notes.categoryId = Category.id)"),
						"notesCount",
					],
				],
			},
			order: [[sequelize.literal("notesCount"), "DESC"]],
		});
		return categories;
	}
}
