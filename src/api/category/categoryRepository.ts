import {
	ICreateCategoryResponse,
	ICreateCategory,
	ICategoryResponse,
	ICategoriesResponse,
	IGetCategory,
	IUpdateCategory,
} from "@/schemas/category";
import Category from "./categoryModel";
import sequelize from "@/config/dbconfig";
import { WhereOptions } from "sequelize";

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

	public async updateCategory(
		userId: string,
		categoryId: IGetCategory["categoryId"],
		payload: IUpdateCategory,
	): Promise<ICategoryResponse | null> {
		const whereClause: WhereOptions = { categoryAuthorId: userId, id: categoryId };

		const category = await Category.findOne({
			where: whereClause,
		});

		if (!category) return null;

		const [affectedRows] = await Category.update(payload, {
			where: whereClause,
		});

		if (affectedRows === 0) return null;

		const updatedCategory = await Category.findOne({
			where: whereClause,
		});

		return updatedCategory;
	}

	public async deleteCategory(
		userId: string,
		categoryId: IGetCategory["categoryId"],
	): Promise<boolean> {
		const whereClause: WhereOptions = { categoryAuthorId: userId, id: categoryId };

		const category = await Category.findOne({ where: whereClause });

		if (!category) return false;

		const deletedRows = await Category.destroy({ where: whereClause });
		if (deletedRows === 0) return false;
		return true;
	}
}
