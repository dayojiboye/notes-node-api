import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import {
	badTokenFormatMessage,
	invalidTokenMessage,
	unauthorizedMessage,
} from "../constants/messages";

function validateToken(req: Request, res: Response, next: NextFunction) {
	let token;
	let authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split("Bearer ")[1];
		if (token) {
			jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, decodedToken: any) => {
				if (err) {
					if (err.message.includes("jwt expired")) {
						res.status(StatusCodes.UNAUTHORIZED).json({ message: invalidTokenMessage });
					} else {
						res.status(StatusCodes.UNAUTHORIZED).json({ message: unauthorizedMessage });
					}
				} else {
					next();
				}
			});
		} else {
			res.status(StatusCodes.FORBIDDEN).json({ message: badTokenFormatMessage });
		}
	} else {
		res.status(StatusCodes.FORBIDDEN).json({ message: badTokenFormatMessage });
	}
}

export default validateToken;
