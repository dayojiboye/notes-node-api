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
	declare content: string;
	declare attachments: { fileId: string; url: string; name: string }[];
	declare isPinned: boolean;
	declare authorId: string;
	declare categoryId?: string | null;
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
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		attachments: {
			type: DataTypes.JSON,
			allowNull: false,
			defaultValue: [],
			get() {
				const value = this.getDataValue("attachments");
				return typeof value === "string" ? JSON.parse(value) : value;
			},
		},
		isPinned: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		authorId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		categoryId: {
			type: DataTypes.UUID,
			allowNull: true,
			defaultValue: null,
		},
	},
	{
		sequelize,
		timestamps: true,
	},
);

export default Note;
