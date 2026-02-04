import { ISignup, SignupSchema } from "@/schemas/auth";
import { AuthRepository } from "./authRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { IAuthResponse } from "@/schemas/user";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { userService } from "../user/userService";

class AuthService {
	private authRepository: AuthRepository;

	constructor(repository: AuthRepository = new AuthRepository()) {
		this.authRepository = repository;
	}

	public async signup(payload: ISignup): Promise<ServiceResponse<IAuthResponse | null>> {
		try {
			const { error } = SignupSchema.shape.body.safeParse(payload);

			if (error) {
				return ServiceResponse.failure(error.message, null, StatusCodes.BAD_REQUEST);
			}

			const emailExists = await userService.getUserByEmail(payload.email);

			if (emailExists) {
				return ServiceResponse.failure("Email already taken", null, StatusCodes.CONFLICT);
			}

			const user = await this.authRepository.signup(payload);
			const accessToken = this.createToken(user.id);

			const authResponse: IAuthResponse = {
				...user,
				accessToken: accessToken,
				expiryTimeInMinutes: process.env.ACCESS_TOKEN_MAX_AGE_MINUTES,
			};

			return ServiceResponse.success<IAuthResponse>("Request processed successfully", authResponse);
		} catch (error) {
			return ServiceResponse.failure(
				"An error occurred, please try again",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	private createToken(id: any) {
		return jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
			expiresIn: Number(process.env.ACCESS_TOKEN_MAX_AGE_MINUTES) * 60,
		});
	}
}

export const authService = new AuthService();
