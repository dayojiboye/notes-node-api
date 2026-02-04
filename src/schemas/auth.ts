import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const AuthSchema = z.object({
	email: z.string().email("Enter a valid email address").trim(),
	password: z
		.string()
		.trim()
		.min(8, "Password must be at least 8 characters")
		.refine(
			(val) =>
				/[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val),
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		),
});

export const SignupSchema = z.object({
	body: AuthSchema.extend({
		firstName: z.string().trim().min(1, "First name is required"),
		lastName: z.string().trim().min(1, "Last name is required"),
	}),
});

export type IAuth = z.infer<typeof AuthSchema>;
export type ISignup = z.infer<typeof SignupSchema>["body"];
