import {
	ICreateNote,
	IDeleteAttachment,
	IGetCategoryNotesParams,
	IGetNote,
	INoteResponse,
	INotesResponse,
	IRemoveNoteFromCategory,
	IUpdateNote,
} from "@/schemas/note";
import Note from "./noteModel";
import { Op, WhereOptions } from "sequelize";
import DOMPurify from "isomorphic-dompurify";
import { ImageKitService } from "../imageKit/imageKitService";
import { isAttachmentFoundInNote } from "@/common/utils/helpers";

export class NoteRepository {
	public async createNote(userId: string, payload: ICreateNote): Promise<INoteResponse> {
		const newNote = await Note.create({
			...payload,
			content: DOMPurify.sanitize(payload.content),
			authorId: userId,
		});
		return newNote;
	}

	public async getUserNotes(
		userId: string,
		searchText?: string,
		page: number = 1,
	): Promise<INotesResponse> {
		const limit = 20;
		const offset = (page - 1) * limit;

		const whereClause: WhereOptions = {
			authorId: userId,
		};

		if (searchText && searchText.trim()) {
			whereClause.content = { [Op.like]: `%${searchText.trim()}%` };
		}

		const { count, rows } = await Note.findAndCountAll({
			where: whereClause,
			order: [
				["isPinned", "DESC"],
				["updatedAt", "DESC"],
			],
			limit,
			offset,
		});

		return {
			notes: rows.map((note) => note.toJSON()),
			totalElements: count,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		};
	}

	public async getNote(noteId: IGetNote["noteId"], userId: string): Promise<INoteResponse | null> {
		const note = await Note.findOne({ where: { id: noteId, authorId: userId } });
		return note;
	}

	public async updateNote(
		noteId: IGetNote["noteId"],
		userId: string,
		payload: IUpdateNote,
	): Promise<INoteResponse | null> {
		const note = await this.getNote(noteId, userId);

		if (!note) {
			return null;
		}

		const updateNotePayload: IUpdateNote = {
			...payload,
			attachments: note.attachments
				? [...(payload.attachments || []), ...note.attachments]
				: payload.attachments,
		};

		if (payload.content) {
			updateNotePayload.content = DOMPurify.sanitize(payload.content);
		}

		const [affectedRows] = await Note.update(updateNotePayload, {
			where: { id: noteId, authorId: userId },
		});

		if (affectedRows === 0) {
			return null;
		}

		const updatedNote = await this.getNote(noteId, userId);
		return updatedNote;
	}

	public async deleteAttachment(
		noteId: IDeleteAttachment["noteId"],
		userId: string,
		attachmentId: IDeleteAttachment["attachmentId"],
	): Promise<INoteResponse | null> {
		const note = await this.getNote(noteId, userId);

		if (!note) return null;

		const attachmentExistsInNote = isAttachmentFoundInNote(note, attachmentId);

		if (!attachmentExistsInNote) {
			throw new Error("Attachment not found in note");
		}

		await ImageKitService.deleteFromImageKit(attachmentId);

		const updatedAttachments = note.attachments?.filter(
			(attachment) => attachment.fileId !== attachmentId,
		);

		const [affectedRows] = await Note.update(
			{ attachments: updatedAttachments },
			{
				where: { id: noteId, authorId: userId },
			},
		);

		if (affectedRows === 0) return null;

		const updatedNote = await this.getNote(noteId, userId);
		return updatedNote;
	}

	public async deleteNote(noteId: IGetNote["noteId"], userId: string): Promise<boolean> {
		const note = await this.getNote(noteId, userId);

		if (!note) {
			return false;
		}

		const deletedRows = await Note.destroy({ where: { id: noteId, authorId: userId } });

		if (deletedRows === 0) {
			return false;
		}

		if (note.attachments && note.attachments.length > 0) {
			const attachmentIds = note.attachments.map((attachment) => attachment.fileId);

			ImageKitService.deleteMultipleFiles(attachmentIds).catch((error) => {
				console.error("ImageKit deletion failed, queuing for retry: ", error);
				// Might add to a cleanup queue in case this fails
			});
		}

		return true;
	}

	public async removeNoteFromCategory(
		noteId: IRemoveNoteFromCategory["noteId"],
		categoryId: IRemoveNoteFromCategory["categoryId"],
		userId: string,
	): Promise<boolean> {
		const note = this.getNote(noteId, userId);

		if (!note) return false;

		const [affectedRows] = await Note.update(
			{ categoryId: null },
			{
				where: { id: noteId, authorId: userId, categoryId },
			},
		);

		if (affectedRows === 0) return false;
		return true;
	}

	public async getAllNotesInCategory(
		userId: string,
		categoryId: IGetCategoryNotesParams["categoryId"],
		searchText?: string,
		page: number = 1,
	): Promise<INotesResponse> {
		const limit = 20;
		const offset = (page - 1) * limit;

		const whereClause: WhereOptions = {
			authorId: userId,
			categoryId,
		};

		if (searchText && searchText.trim()) {
			whereClause.content = { [Op.like]: `%${searchText.trim()}%` };
		}

		const { count, rows } = await Note.findAndCountAll({
			where: whereClause,
			order: [
				["isPinned", "DESC"],
				["updatedAt", "DESC"],
			],
			limit,
			offset,
		});

		return {
			notes: rows.map((note) => note.toJSON()),
			totalElements: count,
			totalPages: Math.ceil(count / limit),
			currentPage: page,
		};
	}
}
