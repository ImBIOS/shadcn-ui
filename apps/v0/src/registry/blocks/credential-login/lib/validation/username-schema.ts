import { z } from "zod";

/**
 * Username validation schema using Zod
 * Validates username format:
 * - 3-30 characters
 * - Letters, numbers, hyphens, and underscores only
 */
export const usernameSchema = z
  .string({ message: "auth.errors.required" })
  .min(3, { message: "auth.errors.invalidUsername" })
  .max(30, { message: "auth.errors.invalidUsername" })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "auth.errors.invalidUsername" });

/**
 * Username credential form schema
 * Used for username-based authentication
 */
export const usernameCredentialSchema = z.object({
  identifier: usernameSchema,
  password: z
    .string({ message: "auth.errors.required" })
    .min(1, { message: "auth.errors.required" }),
  rememberMe: z.boolean().optional(),
});

export type UsernameCredential = z.infer<typeof usernameCredentialSchema>;
