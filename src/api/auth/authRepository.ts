import { ILogin, ISignup } from "@/schemas/auth";
import { IUser } from "@/schemas/user";
import { userService } from "../user/userService";
import User from "../user/userModel";

export class AuthRepository {
	public async signup(payload: ISignup): Promise<IUser> {
		const authResponse = await userService.createUser(payload);
		return authResponse;
	}

	public async loginUser(payload: ILogin): Promise<IUser | null> {
		const user = await User.login(payload.email, payload.password);

		if (!user) {
			return null;
		}

		const userWithoutPassword = await User.findByPk(user.id);

		if (!userWithoutPassword) {
			return null;
		}

		return userWithoutPassword.toJSON();
	}
}
