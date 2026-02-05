import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { MulterError } from "multer";

const unexpectedRequest: RequestHandler = (_req, res) => {
	res.status(StatusCodes.NOT_FOUND).send("Not Found");
};

const multerErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (err instanceof MulterError) {
		if (err.code === "LIMIT_FILE_COUNT") {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: "Maximum 5 files allowed per upload",
			});
		}

		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: "File size cannot exceed 5MB",
			});
		}

		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: err.message,
		});
	}

	if (err.message === "Invalid file type") {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Invalid file type. Allowed types: jpeg, jpg, png, pdf, doc, docx",
		});
	}

	next(err);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
	res.locals.err = err;
	next(err);
};

export default (): [RequestHandler, ErrorRequestHandler, ErrorRequestHandler] => [
	unexpectedRequest,
	multerErrorHandler,
	addErrorToRequestLog,
];
