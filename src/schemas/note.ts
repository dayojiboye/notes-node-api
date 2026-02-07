import { commonValidations } from "@/common/utils/commonValidation";
import { z } from "zod";

export const AttachmentSchema = z.object({
	fileId: z.string(),
	url: z.string(),
	name: z.string(),
});

export const NoteSchema = z.object({
	categoryId: z.string().optional().nullable(),
	content: z.string().trim().min(1, "Enter content for note"),
	isPinned: z
		.enum(["true", "false"])
		.optional()
		.transform((val) => val === "true")
		.default("false"),
	attachments: z.array(AttachmentSchema).max(5, "Maximum of 5 files allowed per upload").optional(),
});

export const NoteResponseSchema = NoteSchema.extend({
	id: z.string(),
	authorId: z.string().min(1, "Author ID is required"),
	isPinned: z.boolean().default(false),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	attachments: z.array(AttachmentSchema).optional(),
});

export const CreateNoteSchema = z.object({
	body: NoteSchema,
});

export const NotesResponseSchema = z.object({
	notes: z.array(NoteResponseSchema),
	totalElements: z.number(),
	totalPages: z.number(),
	currentPage: z.number(),
});

export const NotesQuerySchema = z.object({
	query: z.object({
		searchText: z.string().trim().optional(),
		page: z
			.string()
			.optional()
			.transform((val) => Number(val || "1")),
	}),
});

export const GetNoteSchema = z.object({
	params: z.object({ noteId: commonValidations.id }),
});

export const UpdateNoteSchema = z.object({
	params: z.object({ noteId: commonValidations.id }),
	body: NoteSchema.partial(),
});

export type IAttachment = z.infer<typeof AttachmentSchema>;
export type INote = z.infer<typeof NoteSchema>;
export type INoteResponse = z.infer<typeof NoteResponseSchema>;
export type ICreateNote = z.infer<typeof CreateNoteSchema>["body"];
export type INotesResponse = z.infer<typeof NotesResponseSchema>;
export type IGetNote = z.infer<typeof GetNoteSchema>["params"];
export type IUpdateNote = z.infer<typeof UpdateNoteSchema>["body"];
