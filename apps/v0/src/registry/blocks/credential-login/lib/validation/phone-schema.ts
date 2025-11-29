import { z } from "zod";

/**
 * Phone number validation schema using Zod
 * Validates phone numbers in E.164 format
 * E.164 format: +[country code][subscriber number]
 * Example: +12025551234
 */
export const phoneSchema = z
  .string({ message: "auth.errors.required" })
  .regex(/^\+?[1-9]\d{1,14}$/, { message: "auth.errors.invalidPhone" });

/**
 * Phone credential form schema
 * Used for phone-based authentication
 */
export const phoneCredentialSchema = z.object({
  identifier: phoneSchema,
  password: z
    .string({ message: "auth.errors.required" })
    .min(1, { message: "auth.errors.required" }),
  rememberMe: z.boolean().optional(),
});

export type PhoneCredential = z.infer<typeof phoneCredentialSchema>;
