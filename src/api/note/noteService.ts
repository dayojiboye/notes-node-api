import { ServiceResponse } from "@/common/models/serviceResponse";
import { NoteRepository } from "./noteRepository";
import {
	ICreateNote,
	IGetNote,
	INoteResponse,
	INotesResponse,
	NoteResponseSchema,
	NotesResponseSchema,
} from "@/schemas/note";
import { StatusCodes } from "http-status-codes";
import {
	defaultSuccessMessage,
	noteNotFoundMessage,
	serverErrorMessage,
} from "@/common/constants/messages";

class NoteService {
	private noteRepository: NoteRepository;

	constructor(repository: NoteRepository = new NoteRepository()) {
		this.noteRepository = repository;
	}

	public async createNote(
		userId: string,
		payload: ICreateNote,
	): Promise<ServiceResponse<INoteResponse | null>> {
		try {
			const note = await this.noteRepository.createNote(userId, payload);
			const validatedNote = NoteResponseSchema.parse(note);
			return ServiceResponse.success<INoteResponse>("Note created successfully", validatedNote);
		} catch (error) {
			return ServiceResponse.failure(serverErrorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public async getUserNotes(
		userId: string,
		searchText?: string,
		page: number = 1,
	): Promise<ServiceResponse<INotesResponse | null>> {
		try {
			const notes = await this.noteRepository.getUserNotes(userId, searchText, page);
			const validatedNotes = NotesResponseSchema.parse(notes);
			return ServiceResponse.success<INotesResponse>(defaultSuccessMessage, validatedNotes);
		} catch (error) {
			return ServiceResponse.failure(serverErrorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public async getNote(
		noteId: IGetNote["noteId"],
		userId: string,
	): Promise<ServiceResponse<INoteResponse | null>> {
		try {
			const note = await this.noteRepository.getNote(noteId, userId);

			if (!note) {
				return ServiceResponse.failure(noteNotFoundMessage, null, StatusCodes.NOT_FOUND);
			}

			const validatedNote = NoteResponseSchema.parse(note);
			return ServiceResponse.success<INoteResponse>(defaultSuccessMessage, validatedNote);
		} catch (error) {
			return ServiceResponse.failure(serverErrorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const noteService = new NoteService();
