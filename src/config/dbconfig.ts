import { env } from "@/common/utils/envConfig";
import { dbConfigInterface } from "@/interfaces/config";
import { Sequelize } from "sequelize";

const { DB_USER, HOST, PASSWORD } = env;

const dbConfig: dbConfigInterface = {
	HOST,
	USER: DB_USER,
	PASSWORD,
	DB: process.env.DB!,
	dialect: "mysql",

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,

	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});

sequelize
	.authenticate()
	.then(() => console.log("Connected to DB"))
	.catch((err) => console.log("Error: " + err));

export default sequelize;
