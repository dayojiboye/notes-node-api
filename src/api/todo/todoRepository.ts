import { ICreateTodo, ITodo } from "@/schemas/todo";
import Todo from "./todoModel";
import { Op, WhereOptions } from "sequelize";

export class TodoRepository {
	async addTodo(todo: ICreateTodo): Promise<ITodo> {
		const newTodo = await Todo.create(todo);
		return newTodo;
	}

	async getAllTodos(searchText?: string, isCompleted?: string): Promise<ITodo[]> {
		const whereClause: WhereOptions = {};

		if (searchText) {
			whereClause.text = { [Op.like]: `%${searchText}%` };
		}

		if (isCompleted !== undefined) {
			whereClause.isCompleted = isCompleted === "true";
		}

		const allTodos = await Todo.findAll({
			where: whereClause,
			order: [["createdAt", "DESC"]],
		});

		return allTodos;
	}

	async getTodo(id: string): Promise<ITodo | null> {
		const todo = await Todo.findByPk(id);
		return todo;
	}

	async updateTodo(id: string, todo: Partial<ICreateTodo>): Promise<ITodo | null> {
		const [affectedRows] = await Todo.update(todo, { where: { id } });

		if (affectedRows === 0) {
			return null;
		}

		const updatedTodo = await Todo.findByPk(id);
		return updatedTodo;
	}

	async deleteTodo(id: string): Promise<boolean> {
		const deletedRows = await Todo.destroy({ where: { id } });
		return deletedRows > 0;
	}
}
