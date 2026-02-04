import type { Request, RequestHandler, Response } from "express";
import { todoService } from "./todoService";

class TodoController {
	public createTodo: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await todoService.createTodo(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getAllTodos: RequestHandler = async (req: Request, res: Response) => {
		const { searchText, isCompleted } = req.query;

		const serviceResponse = await todoService.getAllTodos(
			searchText as string | undefined,
			isCompleted as string | undefined,
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getTodo: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await todoService.getTodo(req.params.id as string);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateTodo: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await todoService.updateTodo(req.params.id as string, req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteTodo: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await todoService.deleteTodo(req.params.id as string);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const todoController = new TodoController();
