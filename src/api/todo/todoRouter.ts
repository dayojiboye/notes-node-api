import { validateRequest } from "@/common/utils/httpHandlers";
import {
	CreateTodoSchema,
	GetTodoSchema,
	TodoFilterSchema,
	TodoSchema,
	UpdateTodoSchema,
} from "@/schemas/todo";
import express, { Router } from "express";
import { todoController } from "./todoController";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { z } from "zod";

export const todoRegistry = new OpenAPIRegistry();
export const todoRouter: Router = express.Router();

todoRegistry.register("Todo", TodoSchema);

// Create Todo
todoRegistry.registerPath({
	method: "post",
	path: "/todos",
	tags: ["Todo"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: CreateTodoSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(TodoSchema, "Success"),
});

todoRouter.post("/", validateRequest(CreateTodoSchema), todoController.createTodo);

// Get All Todos
todoRegistry.registerPath({
	method: "get",
	path: "/todos",
	tags: ["Todo"],
	request: {
		query: TodoFilterSchema.shape.query,
	},
	responses: createApiResponse(z.array(TodoSchema), "Success"),
});

todoRouter.get("/", validateRequest(TodoFilterSchema), todoController.getAllTodos);

// Get Todo
todoRegistry.registerPath({
	method: "get",
	path: "/todos/{id}",
	tags: ["Todo"],
	request: { params: GetTodoSchema.shape.params },
	responses: createApiResponse(TodoSchema, "Success"),
});

todoRouter.get("/:id", validateRequest(GetTodoSchema), todoController.getTodo);

// Update Todo
todoRegistry.registerPath({
	method: "patch",
	path: "/todos/{id}",
	tags: ["Todo"],
	request: {
		params: UpdateTodoSchema.shape.params,
		body: {
			content: {
				"application/json": {
					schema: UpdateTodoSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(TodoSchema, "Success"),
});

todoRouter.patch("/:id", validateRequest(UpdateTodoSchema), todoController.updateTodo);

// Delete Todo
todoRegistry.registerPath({
	method: "delete",
	path: "/todos/{id}",
	tags: ["Todo"],
	request: { params: GetTodoSchema.shape.params },
	responses: createApiResponse(z.null(), "Success"),
});

todoRouter.delete("/:id", validateRequest(GetTodoSchema), todoController.deleteTodo);
