import { Request, RequestHandler, Response } from "express";
import { noteService } from "./noteService";
import { ICreateNote } from "@/schemas/note";
import DOMPurify from "isomorphic-dompurify";

class NoteController {
	public createNote: RequestHandler = async (req: Request, res: Response) => {
		const content = req.body.content;
		const cleanContent = DOMPurify.sanitize(content);

		const notePayload: ICreateNote = {
			...req.body,
			authorId: res.locals.user.id,
			content: cleanContent,
		};

		const attachments = req.files as Express.Multer.File[];

		const serviceResponse = await noteService.createNote(notePayload, attachments);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const noteController = new NoteController();
