import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
// import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import apiBaseUrl from "./config/apiBaseUrl";
import { authRouter } from "./api/auth/authRouter";
import checkUser from "./common/middleware/checkUserHandler";
import { userRouter } from "./api/user/userRouter";
import validateToken from "./common/middleware/validateTokenHandler";
import { noteRouter } from "./api/note/noteRouter";
import { categoryRouter } from "./api/category/categoryRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);
app.use(`${apiBaseUrl}`, checkUser);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use(`${apiBaseUrl}/auth`, authRouter);
app.use(`${apiBaseUrl}/user`, validateToken, userRouter);
app.use(`${apiBaseUrl}/note`, validateToken, noteRouter);
app.use(`${apiBaseUrl}/category`, validateToken, categoryRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
