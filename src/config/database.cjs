require("dotenv").config();

module.exports = {
	development: {
		host: process.env.HOST,
		username: process.env.DB_USER,
		password: process.env.PASSWORD,
		database: process.env.DB,
		dialect: process.env.DB_DIALECT,
		logging: false,
		port: parseInt(process.env.DB_PORT) || 3306,
	},
	test: {
		host: process.env.HOST,
		username: process.env.DB_USER,
		password: process.env.PASSWORD,
		database: process.env.DB,
		dialect: process.env.DB_DIALECT,
		logging: false,
		port: parseInt(process.env.DB_PORT) || 3306,
	},
	production: {
		host: process.env.HOST,
		username: process.env.DB_USER,
		password: process.env.PASSWORD,
		database: process.env.DB,
		dialect: process.env.DB_DIALECT,
		logging: false,
		port: parseInt(process.env.DB_PORT) || 3306,
	},
};
