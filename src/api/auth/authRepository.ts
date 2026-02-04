import { ISignup } from "@/schemas/auth";
import { IUser } from "@/schemas/user";
import { userService } from "../user/userService";

export class AuthRepository {
	public async signup(payload: ISignup): Promise<IUser> {
		const authResponse = await userService.createUser(payload);
		return authResponse;
	}

	public async login() {}
}
