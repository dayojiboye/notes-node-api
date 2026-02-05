import sequelize from "@/config/dbconfig";
import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from "sequelize";

class Note extends Model<
	InferAttributes<Note, { omit: "createdAt" | "updatedAt" }>,
	InferCreationAttributes<Note, { omit: "createdAt" | "updatedAt" }>
> {
	declare id: CreationOptional<string>;
	declare category: string;
	declare content: string;
	declare attachments: string[];
	declare isPinned: boolean;
	declare authorId: string;
	declare categoryId: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Note.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		category: {
			type: DataTypes.STRING,
			defaultValue: "",
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		attachments: {
			type: DataTypes.JSON,
			allowNull: false,
			defaultValue: [],
		},
		isPinned: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		authorId: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		categoryId: {
			type: DataTypes.UUID,
			allowNull: true,
		},
	},
	{
		sequelize,
		timestamps: true,
	},
);

export default Note;
