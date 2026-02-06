import { ServiceResponse } from "@/common/models/serviceResponse";
import { UserRepository } from "./userRepository";
import { IUpdatePasswordBody, IUser } from "@/schemas/user";
import { ISignup } from "@/schemas/auth";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import User from "./userModel";
import { forbiddenErrorMessage, serverErrorMessage } from "@/common/constants/messages";

class UserService {
	private userRepository: UserRepository;

	constructor(repository: UserRepository = new UserRepository()) {
		this.userRepository = repository;
	}

	public async createUser(payload: ISignup): Promise<IUser> {
		return await this.userRepository.createUser(payload);
	}

	public async getUserByEmail(email: string): Promise<IUser | null> {
		return await this.userRepository.findUserByEmail(email);
	}

	public async updatePassword(
		userId: string,
		payload: IUpdatePasswordBody,
	): Promise<ServiceResponse> {
		try {
			const { oldPassword, newPassword, confirmNewPassword, email } = payload;
			const user = await User.scope("withPassword").findOne({ where: { id: userId, email } });

			if (!user) {
				return ServiceResponse.failure(forbiddenErrorMessage, null, StatusCodes.FORBIDDEN);
			}

			if (oldPassword === newPassword) {
				return ServiceResponse.failure(
					"Current password and new password values can not be the same",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			if (confirmNewPassword !== newPassword) {
				return ServiceResponse.failure(
					"Confirm new password does not match with new password",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const auth = await bcrypt.compare(oldPassword, user.password);

			if (!auth) {
				return ServiceResponse.failure(
					"Current password is invalid",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			const updatedUser = await this.userRepository.updatePassword(userId, {
				...payload,
				newPassword: hashedPassword,
			});

			if (!updatedUser) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("Password updated successfully", null);
		} catch (error) {
			return ServiceResponse.failure(serverErrorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userService = new UserService();
