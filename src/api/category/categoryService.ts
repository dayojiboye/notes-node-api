import {
	CreateCategoryResponseSchema,
	ICreateCategoryResponse,
	ICreateCategory,
	ICategoriesResponse,
	CategoriesResponseSchema,
	IGetCategory,
	IUpdateCategory,
	ICategoryResponse,
	CategoryResponseSchema,
} from "@/schemas/category";
import { CategoryRepository } from "./categoryRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import {
	categoryNotFoundMessage,
	defaultSuccessMessage,
	serverErrorMessage,
} from "@/common/constants/messages";
import { StatusCodes } from "http-status-codes";

class CategoryService {
	private categoryRepository: CategoryRepository;

	constructor(repository: CategoryRepository = new CategoryRepository()) {
		this.categoryRepository = repository;
	}

	public async createCategory(
		userId: string,
		payload: ICreateCategory,
	): Promise<ServiceResponse<ICreateCategoryResponse | null>> {
		try {
			const titleExists = await this.categoryRepository.getCategoryByTitle(userId, payload.title);

			if (titleExists) {
				return ServiceResponse.failure("Title already taken", null, StatusCodes.CONFLICT);
			}

			const newCategory = await this.categoryRepository.createCategory(userId, payload);

			const validatedCategory = CreateCategoryResponseSchema.parse(newCategory);
			return ServiceResponse.success<ICreateCategoryResponse>(
				"Category created successfully",
				validatedCategory,
			);
		} catch (error) {
			return ServiceResponse.failure(
				error instanceof Error ? error.message : serverErrorMessage,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async getAllCategories(
		userId: string,
	): Promise<ServiceResponse<ICategoriesResponse | null>> {
		try {
			const categories = await this.categoryRepository.getAllCategories(userId);
			const validatedCategories = CategoriesResponseSchema.parse(categories);
			return ServiceResponse.success<ICategoriesResponse>(
				defaultSuccessMessage,
				validatedCategories,
			);
		} catch (error) {
			return ServiceResponse.failure(
				error instanceof Error ? error.message : serverErrorMessage,
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async updateCategory(
		userId: string,
		categoryId: IGetCategory["categoryId"],
		payload: IUpdateCategory,
	): Promise<ServiceResponse<ICategoryResponse | null>> {
		try {
			const updatedCategory = await this.categoryRepository.updateCategory(
				userId,
				categoryId,
				payload,
			);

			if (!updatedCategory) {
				return ServiceResponse.failure(categoryNotFoundMessage, null, StatusCodes.NOT_FOUND);
			}

			const validatedCategory = CategoryResponseSchema.parse(updatedCategory);
			return ServiceResponse.success(defaultSuccessMessage, validatedCategory);
		} catch (error) {
			return ServiceResponse.failure(serverErrorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const categoryService = new CategoryService();
