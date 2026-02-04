import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import sequelize from "./config/dbconfig";

sequelize
	.sync({ force: false })
	.then(() => console.log("Re-sync done"))
	.catch((err) => console.log(err));

app.listen(env.PORT, () => {
	const { NODE_ENV, HOST, PORT } = env;
	logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});
