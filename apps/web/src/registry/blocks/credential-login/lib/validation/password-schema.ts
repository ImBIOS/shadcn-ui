import { z } from "zod";
import type { PasswordValidation } from "../../types/index";

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBERS_REGEX = /[0-9]/;
const SYMBOLS_REGEX = /[^a-zA-Z0-9]/;

/**
 * Creates a dynamic password validation schema based on provided rules
 * Supports configurable password requirements:
 * - Minimum/maximum length
 * - Uppercase letters
 * - Lowercase letters
 * - Numbers
 * - Special symbols
 *
 * @param validation - Password validation rules
 * @returns Zod schema for password validation
 */
export function getPasswordSchema(validation?: PasswordValidation) {
  const minLength = validation?.minLength ?? 8;
  const maxLength = validation?.maxLength ?? 256;

  let schema = z
    .string({ message: "auth.errors.required" })
    .min(minLength, {
      message: "auth.errors.passwordTooShort",
    })
    .max(maxLength, {
      message: "auth.errors.passwordTooLong",
    });

  // Add uppercase requirement
  if (validation?.requireUppercase) {
    schema = schema.regex(UPPERCASE_REGEX, {
      message: "auth.errors.passwordRequireUppercase",
    });
  }

  // Add lowercase requirement
  if (validation?.requireLowercase) {
    schema = schema.regex(LOWERCASE_REGEX, {
      message: "auth.errors.passwordRequireLowercase",
    });
  }

  // Add numbers requirement
  if (validation?.requireNumbers) {
    schema = schema.regex(NUMBERS_REGEX, {
      message: "auth.errors.passwordRequireNumbers",
    });
  }

  // Add symbols requirement
  if (validation?.requireSymbols) {
    schema = schema.regex(SYMBOLS_REGEX, {
      message: "auth.errors.passwordRequireSymbols",
    });
  }

  return schema;
}

/**
 * Default password schema with minimum requirements only
 */
export const defaultPasswordSchema = getPasswordSchema();
