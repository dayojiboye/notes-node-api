import {
	CreateCategoryResponseSchema,
	ICreateCategoryResponse,
	ICreateCategory,
	ICategoriesResponse,
	CategoriesResponseSchema,
} from "@/schemas/category";
import { CategoryRepository } from "./categoryRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { defaultSuccessMessage, serverErrorMessage } from "@/common/constants/messages";
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
}

export const categoryService = new CategoryService();
