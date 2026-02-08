import { INote } from "@/schemas/note";

export function titleCase(text: string) {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function isAttachmentFoundInNote(note: INote, attachmentId: string) {
	if (!note.attachments || !attachmentId.trim()) return false;
	return note.attachments.some((attachment) => attachment.fileId === attachmentId);
}
