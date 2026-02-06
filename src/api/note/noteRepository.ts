import { ICreateNote, IGetNote, INoteResponse, INotesResponse } from "@/schemas/note";
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
}
