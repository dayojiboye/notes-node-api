import { Request, RequestHandler, Response } from "express";
import { userService } from "./userService";

class UserController {
	public updatePassword: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await userService.updatePassword(res.locals.user.id, req.body);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();
