import { ISignup } from "@/schemas/auth";
import { IUpdatePasswordBody, IUpdatePasswordParams, IUser } from "@/schemas/user";
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

	public async updatePassword(
		userId: IUpdatePasswordParams["userId"],
		payload: IUpdatePasswordBody,
	): Promise<IUser | null> {
		const [affectedRows] = await User.update(
			{
				password: payload.newPassword,
			},
			{ where: { id: userId, email: payload.email } },
		);

		if (affectedRows === 0) {
			return null;
		}

		const user = await User.findByPk(userId);
		return user ? user.toJSON() : null;
	}
}
