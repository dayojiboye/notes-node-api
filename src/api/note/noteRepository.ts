import { IAttachment, ICreateNote, INoteResponse } from "@/schemas/note";
import Note from "./noteModel";

export class NoteRepository {
	public async createNote(
		payload: ICreateNote,
		attachments: IAttachment[],
	): Promise<INoteResponse> {
		const newNote = await Note.create({
			...payload,
			attachments,
		});

		return newNote.toJSON();
	}
}
