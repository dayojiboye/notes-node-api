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
			const zodError = err as ZodError;

			const fieldErrors: Record<string, string[]> = {};

			zodError.errors.forEach((e) => {
				const field = e.path.slice(1).join(".") || "root";

				if (!fieldErrors[field]) {
					fieldErrors[field] = [];
				}

				fieldErrors[field].push(e.message);
			});

			const errorMessages = Object.entries(fieldErrors).map(([field, messages]) => {
				return {
					field,
					message: messages[0],
				};
			});

			// const errorMessage =
			// 	titleCase(errorMessages[0].field) + " is " + errorMessages[0].messages.toLowerCase();

			const errorMessage = errorMessages[0].message;

			const statusCode = StatusCodes.BAD_REQUEST;
			const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
			res.status(serviceResponse.statusCode).send(serviceResponse);
		}
	};
