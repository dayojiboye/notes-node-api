import { Request, RequestHandler, Response } from "express";
import { noteService } from "./noteService";
import { ICreateNote, IUpdateNote } from "@/schemas/note";
import { ImageKitService } from "../imageKit/imageKitService";

class NoteController {
	public createNote: RequestHandler = async (req: Request, res: Response) => {
		const attachments = req.files as Express.Multer.File[];

		const uploadedAttachments =
			attachments.length > 0
				? await Promise.all(
						attachments.map((attachment) => ImageKitService.uploadToImageKit(attachment)),
					)
				: [];

		const notePayload: ICreateNote = {
			...req.body,
			attachments: uploadedAttachments,
		};

		const serviceResponse = await noteService.createNote(res.locals.user.id, notePayload);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUserNotes: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.getUserNotes(
			res.locals.user.id,
			req.query.searchText as string | undefined,
			Number(req.query.page as string) || 1,
		);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getNote: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.getNote(req.params.noteId, res.locals.user.id);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateNote: RequestHandler = async (req: Request, res: Response) => {
		const attachments = req.files as Express.Multer.File[];

		const uploadedAttachments =
			attachments.length > 0
				? await Promise.all(
						attachments.map((attachment) => ImageKitService.uploadToImageKit(attachment)),
					)
				: [];

		const updateNotePayload: IUpdateNote = {
			...req.body,
			attachments: uploadedAttachments,
		};

		const serviceResponse = await noteService.updateNote(
			req.params.noteId,
			res.locals.user.id,
			updateNotePayload,
		);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteAttachment: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.deleteAttachment(
			req.params.noteId,
			res.locals.user.id,
			req.params.attachmentId,
		);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const noteController = new NoteController();
