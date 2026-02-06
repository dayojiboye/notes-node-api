import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import apiBaseUrl from "@/config/apiBaseUrl";
import {
	CreateNoteSchema,
	NoteResponseSchema,
	NotesQuerySchema,
	NotesResponseSchema,
} from "@/schemas/note";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { noteController } from "./noteController";
import { z } from "zod";
import upload from "@/common/middleware/upload";

export const noteRegistry = new OpenAPIRegistry();
export const noteRouter: Router = express.Router();

extendZodWithOpenApi(z);

noteRegistry.register("Note", NoteResponseSchema);

noteRegistry.registerPath({
	method: "post",
	path: `${apiBaseUrl}/note`,
	tags: ["Note Service"],
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: CreateNoteSchema.shape.body.extend({
						isPinned: z.boolean().default(false),
						attachments: z.any().optional().openapi({
							type: "array",
							maxItems: 5,
						}),
					}),
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(NoteResponseSchema, "Success"),
});

noteRouter.post(
	"/",
	upload.array("attachments", 5),
	validateRequest(CreateNoteSchema),
	noteController.createNote,
);

noteRegistry.registerPath({
	method: "get",
	path: `${apiBaseUrl}/note`,
	tags: ["Note Service"],
	request: {
		query: NotesQuerySchema.shape.query.extend({
			page: z.number().default(1),
		}),
	},
	responses: createApiResponse(NotesResponseSchema, "Success"),
});

noteRouter.get("/", validateRequest(NotesQuerySchema), noteController.getUserNotes);
