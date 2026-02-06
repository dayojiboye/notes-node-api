import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { AuthResponseSchema } from "@/schemas/user";
import { LoginSchema, SignupSchema } from "@/schemas/auth";
import { authController } from "./authController";
import apiBaseUrl from "@/config/apiBaseUrl";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", AuthResponseSchema);

authRegistry.registerPath({
	method: "post",
	path: `${apiBaseUrl}/auth/register`,
	tags: ["Auth Service"],
	summary: "Register user",
	request: {
		body: {
			content: {
				"application/json": {
					schema: SignupSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(AuthResponseSchema, "Success"),
});

authRouter.post("/register", validateRequest(SignupSchema), authController.signup);

authRegistry.registerPath({
	method: "post",
	path: `${apiBaseUrl}/auth/login`,
	tags: ["Auth Service"],
	summary: "Login user",
	request: {
		body: {
			content: {
				"application/json": {
					schema: LoginSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(AuthResponseSchema, "Success"),
});

authRouter.post("/login", validateRequest(LoginSchema), authController.login);
