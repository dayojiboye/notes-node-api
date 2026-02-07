import { ICreateNote, IGetNote, INoteResponse, INotesResponse, IUpdateNote } from "@/schemas/note";
import Note from "./noteModel";
import { Op, WhereOptions } from "sequelize";

export class NoteRepository {
	public async createNote(userId: string, payload: ICreateNote): Promise<INoteResponse> {
		const newNote = await Note.create({
			...payload,
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
			content: payload.content || note.content,
			attachments: note.attachments
				? [...(payload.attachments || []), ...note.attachments]
				: payload.attachments,
		};

		const [affectedRows] = await Note.update(updateNotePayload, {
			where: { id: noteId, authorId: userId },
		});

		if (affectedRows === 0) {
			return null;
		}

		const updatedNote = await this.getNote(noteId, userId);
		return updatedNote;
	}
}
