import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email("Enter a valid email address").trim(),
	firstName: z.string().trim().min(1, "First name is required"),
	lastName: z.string().trim().min(1, "Last name is required"),
});

export const TokenSchema = z.object({
	token: z.string().min(1, "Access token not available"),
	expiryTimeInMinutes: z.string().min(1, "Expiry time in minutes not available"),
});

export const AuthResponseSchema = z.object({
	user: UserSchema,
	accessToken: TokenSchema,
});

export type IUser = z.infer<typeof UserSchema>;
export type IAuthResponse = z.infer<typeof AuthResponseSchema>;
