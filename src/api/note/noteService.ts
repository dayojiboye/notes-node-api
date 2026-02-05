import { ServiceResponse } from "@/common/models/serviceResponse";
import { NoteRepository } from "./noteRepository";
import { ICreateNote, INoteResponse, NoteResponseSchema } from "@/schemas/note";
import { StatusCodes } from "http-status-codes";
import { ImageKitService } from "../imageKit/imagekitService";

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
			return ServiceResponse.failure(
				"An error occurred while creating note",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const noteService = new NoteService();
