import { ISignup } from "@/schemas/auth";
import { IUser } from "@/schemas/user";
import User from "./userModel";

export class UserRepository {
	public async createUser(payload: ISignup): Promise<IUser> {
		const user = await User.create(payload);
		const userWithoutPassword = await User.findByPk(user.id);
		return userWithoutPassword!.toJSON();
	}

	public async findUserByEmail(email: string): Promise<IUser | null> {
		const user = await User.findOne({ where: { email } });
		return user ? user.toJSON() : null;
	}
}
