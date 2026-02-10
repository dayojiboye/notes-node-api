import { Request, RequestHandler, Response } from "express";
import { categoryService } from "./categoryService";

class CategoryController {
	public createCategory: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await categoryService.createCategory(res.locals.user.id, req.body);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getAllCategories: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await categoryService.getAllCategories(res.locals.user.id);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const categoryController = new CategoryController();
