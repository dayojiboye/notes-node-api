import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { AuthResponseSchema } from "@/schemas/user";
import { SignupSchema } from "@/schemas/auth";
import { authController } from "./authController";
import apiBaseUrl from "@/config/apiBaseUrl";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", AuthResponseSchema);

authRegistry.registerPath({
	method: "post",
	path: `${apiBaseUrl}/auth/register`,
	tags: ["Auth Service"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: SignupSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(AuthResponseSchema, "Success"),
});

authRouter.post("/register", validateRequest(SignupSchema), authController.signup);
