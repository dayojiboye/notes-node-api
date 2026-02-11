import { ILogin, ISignup } from "@/schemas/auth";
import { AuthRepository } from "./authRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { IAuthResponse } from "@/schemas/user";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { userService } from "../user/userService";
import {
	defaultSuccessMessage,
	serverErrorMessage,
	unauthorizedMessage,
} from "@/common/constants/messages";

class AuthService {
	private authRepository: AuthRepository;

	constructor(repository: AuthRepository = new AuthRepository()) {
		this.authRepository = repository;
	}

	public async signup(payload: ISignup): Promise<ServiceResponse<IAuthResponse | null>> {
		try {
			const emailExists = await userService.getUserByEmail(payload.email);

			if (emailExists) {
				return ServiceResponse.failure("Email already taken", null, StatusCodes.CONFLICT);
			}

			const user = await this.authRepository.signup(payload);
			const accessToken = this.createToken(user.id);

			const authResponse: IAuthResponse = {
				user: user,
				accessToken: {
					token: accessToken,
					expiryTimeInMinutes: process.env.ACCESS_TOKEN_MAX_AGE_MINUTES!,
				},
			};

			return ServiceResponse.success<IAuthResponse>(defaultSuccessMessage, authResponse);
		} catch (error) {
			return ServiceResponse.failure(serverErrorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public async login(payload: ILogin): Promise<ServiceResponse<IAuthResponse | null>> {
		try {
			const emailExists = await userService.getUserByEmail(payload.email);

			if (!emailExists) {
				return ServiceResponse.failure(unauthorizedMessage, null, StatusCodes.UNAUTHORIZED);
			}

			const user = await this.authRepository.loginUser(payload);

			if (!user) {
				return ServiceResponse.failure(unauthorizedMessage, null, StatusCodes.UNAUTHORIZED);
			}

			const accessToken = this.createToken(user.id);

			const authResponse: IAuthResponse = {
				user: user,
				accessToken: {
					token: accessToken,
					expiryTimeInMinutes: process.env.ACCESS_TOKEN_MAX_AGE_MINUTES!,
				},
			};

			return ServiceResponse.success<IAuthResponse>(defaultSuccessMessage, authResponse);
		} catch (error) {
			let errorMessage: string;

			if (error instanceof Error) errorMessage = error.message;
			else errorMessage = serverErrorMessage;

			return ServiceResponse.failure(
				errorMessage,
				null,
				error instanceof Error ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR,
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
