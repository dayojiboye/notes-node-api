import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const validateRequest =
	(schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
			next();
		} catch (err) {
			const errors = (err as ZodError).errors.map((e) => {
				const fieldPath = e.path.length > 0 ? e.path.join(".") : "root";
				return `${fieldPath}: ${e.message}`;
			});

			const cleanedErrors = errors.map((e) => {
				const field = e
					.split(":")[0]
					.replace(/^body\./, "")
					.replace(/^query\./, "")
					.replace(/^params\./, "");
				return `${field} is required`;
			});

			const errorMessage =
				cleanedErrors.length === 1
					? `Invalid input: ${cleanedErrors[0]}`
					: `Invalid input (${cleanedErrors.length} errors): ${cleanedErrors.join("; ")}`;

			const statusCode = StatusCodes.BAD_REQUEST;
			const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
			res.status(serviceResponse.statusCode).send(serviceResponse);
		}
	};
