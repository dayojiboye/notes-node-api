import sequelize from "@/config/dbconfig";
import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from "sequelize";

class Category extends Model<
	InferAttributes<Category, { omit: "createdAt" | "updatedAt" }>,
	InferCreationAttributes<Category, { omit: "createdAt" | "updatedAt" }>
> {
	declare id: CreationOptional<string>;
	declare title: string;
	declare emoji?: string;
	declare categoryAuthorId: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Category.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		emoji: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		categoryAuthorId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: true,
	},
);

export default Category;
