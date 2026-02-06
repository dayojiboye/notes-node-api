import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import apiBaseUrl from "@/config/apiBaseUrl";
import { UpdatePasswordSchema, UserSchema } from "@/schemas/user";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { userController } from "./userController";
import { z } from "zod";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "patch",
	path: `${apiBaseUrl}/user/update-password`,
	tags: ["User Service"],
	summary: "Update user's password",
	request: {
		body: {
			content: {
				"application/json": {
					schema: UpdatePasswordSchema.shape.body,
				},
			},
			required: true,
		},
	},
	responses: createApiResponse(z.null(), "Success"),
});

userRouter.patch(
	"/update-password",
	validateRequest(UpdatePasswordSchema),
	userController.updatePassword,
);
