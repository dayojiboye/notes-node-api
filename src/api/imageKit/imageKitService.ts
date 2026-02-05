import { imagekit } from "@/config/imagekit";
import { IAttachment } from "@/schemas/note";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

export class ImageKitService {
	static async uploadToImageKit(file: Express.Multer.File): Promise<IAttachment> {
		try {
			const result: UploadResponse = await imagekit.upload({
				file: file.buffer,
				fileName: `${file.originalname}-${Date.now()}`,
				folder: "/notes-node-api-attachments",
				useUniqueFileName: true,
			});

			return {
				fileId: result.fileId,
				url: result.url,
				name: result.name,
			};
		} catch (error) {
			console.error("ImageKit upload error:", error);
			throw new Error("Failed to upload file to ImageKit");
		}
	}

	static async deleteFromImageKit(fileId: string): Promise<void> {
		try {
			await imagekit.deleteFile(fileId);
		} catch (error) {
			console.error("ImageKit delete error:", error);
			throw new Error("Failed to delete file from ImageKit");
		}
	}

	static async deleteMultipleFiles(fileIds: string[]): Promise<void> {
		await Promise.all(fileIds.map((fileId) => this.deleteFromImageKit(fileId)));
	}
}
