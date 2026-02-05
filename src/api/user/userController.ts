import { Request, RequestHandler, Response } from "express";
import { userService } from "./userService";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { forbiddenErrorMessage } from "@/common/constants/messages";

class UserController {
	public updatePassword: RequestHandler = async (req: Request, res: Response) => {
		if (res.locals.user.id !== req.params.userId) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.send(ServiceResponse.failure(forbiddenErrorMessage, null, StatusCodes.FORBIDDEN));
		}

		const serviceResponse = await userService.updatePassword(req.params.userId, req.body);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();
