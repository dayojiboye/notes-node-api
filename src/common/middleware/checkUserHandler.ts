import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "@/api/user/userModel";
import { StatusCodes } from "http-status-codes";
import { invalidTokenMessage } from "../constants/messages";

function checkUser(req: Request, res: Response, next: NextFunction) {
	let token;
	let authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split("Bearer ")[1];
		if (token) {
			jwt.verify(token, process.env.JWT_SECRET_KEY!, async (err, decodedToken: any) => {
				if (err) {
					res.locals.user = null;
					next();
				} else {
					let user = await User.findByPk(decodedToken.id);
					if (!user) {
						res.locals.user = null;
						res.status(StatusCodes.UNAUTHORIZED).json({ message: invalidTokenMessage });
						return;
					}
					res.locals.user = user;
					next();
				}
			});
		} else {
			res.locals.user = null;
			next();
		}
	} else {
		res.locals.user = null;
		next();
	}
}

export default checkUser;
