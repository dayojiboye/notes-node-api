import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const AttachmentSchema = z.object({
	fileId: z.string(),
	url: z.string(),
	name: z.string(),
});

export const NoteSchema = z.object({
	category: z.string().trim().optional(),
	content: z.string().trim().min(1, "Enter content for note"),
	isPinned: z
		.string()
		.optional()
		.transform((val) => val === "true"),
});

export const NoteResponseSchema = NoteSchema.extend({
	id: z.string(),
	authorId: z.string(),
	categoryId: z.string(),
	attachments: z.array(AttachmentSchema).max(5, "Maximum 5 attachments allowed").default([]),
});

export const CreateNoteSchema = z.object({
	body: NoteSchema,
});

export type IAttachment = z.infer<typeof AttachmentSchema>;
export type INote = z.infer<typeof NoteSchema>;
export type INoteResponse = z.infer<typeof NoteResponseSchema>;
export type ICreateNote = z.infer<typeof CreateNoteSchema>["body"];
