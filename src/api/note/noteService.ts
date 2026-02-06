import { ServiceResponse } from "@/common/models/serviceResponse";
import { NoteRepository } from "./noteRepository";
import {
	ICreateNote,
	INoteResponse,
	INotesResponse,
	NoteResponseSchema,
	NotesResponseSchema,
} from "@/schemas/note";
import { StatusCodes } from "http-status-codes";
import { ImageKitService } from "../imageKit/imagekitService";
import { defaultSuccessMessage, serverErrorMessage } from "@/common/constants/messages";

class NoteService {
	private noteRepository: NoteRepository;

	constructor(repository: NoteRepository = new NoteRepository()) {
		this.noteRepository = repository;
	}

	public async createNote(
		payload: ICreateNote,
		attachments: Express.Multer.File[],
	): Promise<ServiceResponse<INoteResponse | null>> {
		try {
			const uploadedAttachments =
				attachments.length > 0
					? await Promise.all(
							attachments.map((attachment) => ImageKitService.uploadToImageKit(attachment)),
						)
					: [];

			const note = await this.noteRepository.createNote(payload, uploadedAttachments);
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
}

export const noteService = new NoteService();
