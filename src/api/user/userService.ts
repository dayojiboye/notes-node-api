import { ServiceResponse } from "@/common/models/serviceResponse";
import { UserRepository } from "./userRepository";
import { IUser, UserSchema } from "@/schemas/user";
import { ISignup } from "@/schemas/auth";
import { StatusCodes } from "http-status-codes";

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
}

export const userService = new UserService();
