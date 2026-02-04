import sequelize from "@/config/dbconfig";
import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from "sequelize";

class Todo extends Model<
	InferAttributes<Todo, { omit: "createdAt" | "updatedAt" }>,
	InferCreationAttributes<Todo, { omit: "createdAt" | "updatedAt" }>
> {
	declare id: CreationOptional<string>;
	declare text: string;
	declare isCompleted: boolean;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Todo.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		isCompleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		sequelize,
		timestamps: true,
	},
);

export default Todo;
