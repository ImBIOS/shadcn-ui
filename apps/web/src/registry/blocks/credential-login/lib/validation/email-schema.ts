import { z } from "zod";

/**
 * Email validation schema using Zod
 * Validates email format according to RFC 5322 standard
 */
export const emailSchema = z
  .string({ message: "auth.errors.required" })
  .min(1, { message: "auth.errors.required" })
  .email({ message: "auth.errors.invalidEmail" });

/**
 * Email credential form schema
 * Used for email-based authentication
 */
export const emailCredentialSchema = z.object({
  identifier: emailSchema,
  password: z
    .string({ message: "auth.errors.required" })
    .min(1, { message: "auth.errors.required" }),
  rememberMe: z.boolean().optional(),
});

export type EmailCredential = z.infer<typeof emailCredentialSchema>;
