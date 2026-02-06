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

export const UpdatePasswordSchema = z.object({
	body: z
		.object({
			email: z.string().email("Enter a valid email address").trim(),
			oldPassword: z.string().trim().min(8, "Current password must be at least 8 characters"),
			newPassword: z
				.string()
				.trim()
				.min(8, "New password must be at least 8 characters")
				.refine(
					(val) =>
						/[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val),
					"New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				),
			confirmNewPassword: z.string().trim().min(8, { message: "Re-enter new password" }),
		})
		.refine((data) => data.newPassword === data.confirmNewPassword, {
			message: "Passwords do not match",
			path: ["confirmNewPassword"],
		}),
});

export type IUser = z.infer<typeof UserSchema>;
export type IAuthResponse = z.infer<typeof AuthResponseSchema>;
export type IUpdatePasswordBody = z.infer<typeof UpdatePasswordSchema>["body"];
