import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import apiBaseUrl from "@/config/apiBaseUrl";
import { UpdatePasswordSchema, UserSchema } from "@/schemas/user";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "patch",
	path: `${apiBaseUrl}/user/update-password/{userId}`,
	tags: ["User Service"],
	request: {
		params: UpdatePasswordSchema.shape.params,
		body: {
			content: {
				"application/json": {
					schema: UpdatePasswordSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(UserSchema, "Success"),
});

userRouter.patch(
	"/update-password/:userId",
	validateRequest(UpdatePasswordSchema),
	userController.updatePassword,
);
