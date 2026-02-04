import { ICreateTodo, ITodo, TodoArraySchema, TodoSchema } from "@/schemas/todo";
import { TodoRepository } from "./todoRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

class TodoService {
	private todoRepository: TodoRepository;

	constructor(repository: TodoRepository = new TodoRepository()) {
		this.todoRepository = repository;
	}

	async createTodo(todo: ICreateTodo): Promise<ServiceResponse<ITodo | null>> {
		try {
			const newTodo = await this.todoRepository.addTodo(todo);
			const validatedTodo = TodoSchema.parse(newTodo);
			return ServiceResponse.success<ITodo>("Todo created successfully", validatedTodo);
		} catch (error) {
			return ServiceResponse.failure(
				"An error occurred while creating todo",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getAllTodos(
		searchText?: string,
		isCompleted?: string,
	): Promise<ServiceResponse<ITodo[] | null>> {
		try {
			const allTodos = await this.todoRepository.getAllTodos(searchText, isCompleted);
			const validatedTodos = TodoArraySchema.parse(allTodos);
			return ServiceResponse.success<ITodo[]>("Todos retrieved successfully", validatedTodos);
		} catch (error) {
			return ServiceResponse.failure(
				"An error occurred while retrieving todos",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getTodo(id: string): Promise<ServiceResponse<ITodo | null>> {
		try {
			const todo = await this.todoRepository.getTodo(id);

			if (!todo) {
				return ServiceResponse.failure("Todo not found", null, StatusCodes.NOT_FOUND);
			}

			const validatedTodo = TodoSchema.parse(todo);
			return ServiceResponse.success<ITodo>("Todo retrieved successfully", validatedTodo);
		} catch (error) {
			return ServiceResponse.failure(
				"An error occurred while finding todo",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateTodo(id: string, todo: Partial<ICreateTodo>): Promise<ServiceResponse<ITodo | null>> {
		try {
			const updatedTodo = await this.todoRepository.updateTodo(id, todo);

			if (!updatedTodo) {
				return ServiceResponse.failure("Todo not found", null, StatusCodes.NOT_FOUND);
			}

			const validatedTodo = TodoSchema.parse(updatedTodo);
			return ServiceResponse.success<ITodo>("Todo updated successfully", validatedTodo);
		} catch (error) {
			return ServiceResponse.failure(
				"An error occurred while updating todo",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteTodo(id: string): Promise<ServiceResponse<null>> {
		try {
			const deleted = await this.todoRepository.deleteTodo(id);

			if (!deleted) {
				return ServiceResponse.failure("Todo not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("Todo deleted successfully", null);
		} catch (error) {
			return ServiceResponse.failure(
				"An error occurred while deleting todo",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const todoService = new TodoService();
