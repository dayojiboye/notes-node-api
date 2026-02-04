import Category from "@/api/category/categoryModel";
import Note from "@/api/note/noteModel";
import User from "@/api/user/userModel";

export function initializeAssociations() {
	User.hasMany(Note, {
		foreignKey: "authorId",
		as: "notes",
	});

	User.hasMany(Category, {
		foreignKey: "categoryAuthorId",
		as: "categories",
	});

	Note.belongsTo(User, {
		foreignKey: "authorId",
		as: "author",
	});

	Note.belongsTo(Category, {
		foreignKey: "categoryId",
		as: "noteCategory",
	});

	Category.hasMany(Note, {
		foreignKey: "categoryId",
		as: "notes",
	});

	Category.belongsTo(User, {
		foreignKey: "categoryAuthorId",
		as: "author",
	});
}
