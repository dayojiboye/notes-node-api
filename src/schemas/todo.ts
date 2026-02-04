import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const TodoFields = z.object({
	text: z.string().trim().min(1),
	isCompleted: z.boolean().default(false),
});

export const TodoSchema = TodoFields.extend({ id: z.string(), createdAt: z.coerce.date() });

export const TodoArraySchema = z.array(TodoSchema);

export type ITodo = z.infer<typeof TodoSchema>;

export const CreateTodoSchema = z.object({
	body: TodoFields,
});

export type ICreateTodo = z.infer<typeof CreateTodoSchema>["body"];

export const GetTodoSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});

export const TodoFilterSchema = z.object({
	query: z.object({
		searchText: z.string().trim().optional(),
		isCompleted: z
			.enum(["true", "false"])
			.transform((val) => val === "true")
			.optional(),
	}),
});

export type ITodoFilter = z.infer<typeof TodoFilterSchema>["query"];

export const UpdateTodoSchema = z.object({
	params: z.object({ id: commonValidations.id }),
	body: TodoFields.partial(),
});
