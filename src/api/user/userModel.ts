import sequelize from "@/config/dbconfig";
import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from "sequelize";
import bcrypt from "bcrypt";
import { defaultAuthErrorMessage } from "@/common/constants/messages";

class User extends Model<
	InferAttributes<User, { omit: "createdAt" | "updatedAt" }>,
	InferCreationAttributes<User, { omit: "createdAt" | "updatedAt" }>
> {
	declare id: CreationOptional<string>;
	declare email: string;
	declare password: string;
	declare firstName: string;
	declare lastName: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static async login(email: string, password: string): Promise<User | null> {
		const user = await User.scope("withPassword").findOne({ where: { email } });

		if (!user) {
			throw new Error(defaultAuthErrorMessage);
		}

		const auth = await bcrypt.compare(password, user.password);

		if (!auth) {
			throw new Error(defaultAuthErrorMessage);
		}

		const userWithoutPassword = await User.findByPk(user.id);
		return userWithoutPassword;
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: true,
		defaultScope: {
			attributes: { exclude: ["password"] },
		},
		scopes: {
			withPassword: {
				attributes: {} as any,
			},
		},
		hooks: {
			async beforeCreate(user, options) {
				const salt = await bcrypt.genSalt();
				user.dataValues.password = await bcrypt.hash(user.dataValues.password, salt);
			},
		},
	},
);

export default User;
