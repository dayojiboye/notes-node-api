import { Request, RequestHandler, Response } from "express";
import { authService } from "./authService";

class AuthController {
	public signup: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await authService.signup(req.body);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const authController = new AuthController();
