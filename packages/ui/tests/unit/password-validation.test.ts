/**
 * Unit tests for password validation rules
 * @module tests/unit/password-validation
 */

import { describe, expect, it } from "vitest";
import { getPasswordSchema } from "../../src/lib/validation/password-schema";

describe("Password Validation Schema", () => {
  describe("Default Configuration", () => {
    const defaultSchema = getPasswordSchema();

    it("enforces minimum length of 8 characters by default", () => {
      const shortPassword = "pass123";
      const result = defaultSchema.safeParse(shortPassword);
      expect(result.success).toBe(false);
    });

    it("accepts passwords with minimum 8 characters", () => {
      const validPassword = "password";
      const result = defaultSchema.safeParse(validPassword);
      expect(result.success).toBe(true);
    });

    it("accepts long passwords by default", () => {
      const longPassword = "a".repeat(256);
      const result = defaultSchema.safeParse(longPassword);
      expect(result.success).toBe(true);
    });
  });

  describe("Custom Minimum Length", () => {
    it("enforces custom minimum length", () => {
      const schema = getPasswordSchema({ minLength: 12 });

      const shortPassword = "Password1!";
      const result = shortPassword.length < 12;
      expect(result).toBe(true);

      const schemaResult = schema.safeParse(shortPassword);
      expect(schemaResult.success).toBe(false);
    });

    it("accepts passwords meeting custom minimum length", () => {
      const schema = getPasswordSchema({ minLength: 12 });

      const validPassword = "ValidPassword1";
      const result = schema.safeParse(validPassword);
      expect(result.success).toBe(true);
    });

    it("returns error message key for minLength validation", () => {
      const schema = getPasswordSchema({ minLength: 12 });

      const result = schema.safeParse("short");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "auth.errors.passwordTooShort"
        );
      }
    });
  });

  describe("Custom Maximum Length", () => {
    it("enforces custom maximum length", () => {
      const schema = getPasswordSchema({ maxLength: 64 });

      const longPassword = "a".repeat(65);
      const result = schema.safeParse(longPassword);
      expect(result.success).toBe(false);
    });

    it("accepts passwords at maximum length", () => {
      const schema = getPasswordSchema({ maxLength: 64 });

      const validPassword = "a".repeat(64);
      const result = schema.safeParse(validPassword);
      expect(result.success).toBe(true);
    });

    it("returns error message key for maxLength validation", () => {
      const schema = getPasswordSchema({ maxLength: 64 });

      const result = schema.safeParse("a".repeat(65));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "auth.errors.passwordTooLong"
        );
      }
    });
  });

  describe("Uppercase Requirement", () => {
    const schema = getPasswordSchema({ requireUppercase: true });

    it("rejects passwords without uppercase letters", () => {
      const result = schema.safeParse("password123");
      expect(result.success).toBe(false);
    });

    it("accepts passwords with uppercase letters", () => {
      const result = schema.safeParse("Password123");
      expect(result.success).toBe(true);
    });

    it("returns appropriate error message", () => {
      const result = schema.safeParse("password123");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "auth.errors.passwordRequireUppercase"
        );
      }
    });
  });

  describe("Lowercase Requirement", () => {
    const schema = getPasswordSchema({ requireLowercase: true });

    it("rejects passwords without lowercase letters", () => {
      const result = schema.safeParse("PASSWORD123");
      expect(result.success).toBe(false);
    });

    it("accepts passwords with lowercase letters", () => {
      const result = schema.safeParse("PASSWORD123a");
      expect(result.success).toBe(true);
    });

    it("returns appropriate error message", () => {
      const result = schema.safeParse("PASSWORD123");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "auth.errors.passwordRequireLowercase"
        );
      }
    });
  });

  describe("Number Requirement", () => {
    const schema = getPasswordSchema({ requireNumbers: true });

    it("rejects passwords without numbers", () => {
      const result = schema.safeParse("Password!!");
      expect(result.success).toBe(false);
    });

    it("accepts passwords with numbers", () => {
      const result = schema.safeParse("Password1");
      expect(result.success).toBe(true);
    });

    it("returns appropriate error message", () => {
      const result = schema.safeParse("Password!!");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "auth.errors.passwordRequireNumbers"
        );
      }
    });
  });

  describe("Symbol Requirement", () => {
    const schema = getPasswordSchema({ requireSymbols: true });

    it("rejects passwords without symbols", () => {
      const result = schema.safeParse("Password123");
      expect(result.success).toBe(false);
    });

    it("accepts passwords with various symbols", () => {
      const symbolPasswords = [
        "Password!",
        "Password@",
        "Password#",
        "Password$",
        "Password%",
        "Password^",
        "Password&",
        "Password*",
        "Password(",
        "Password)",
        "Password-",
        "Password_",
        "Password+",
        "Password=",
        "Password[",
        "Password]",
        "Password{",
        "Password}",
        "Password|",
        "Password\\",
        "Password:",
        "Password;",
        "Password'",
        'Password"',
        "Password<",
        "Password>",
        "Password,",
        "Password.",
        "Password?",
        "Password/",
        "Password`",
        "Password~",
      ];

      for (const password of symbolPasswords) {
        const result = schema.safeParse(password);
        expect(result.success, `Expected ${password} to be valid`).toBe(true);
      }
    });

    it("returns appropriate error message", () => {
      const result = schema.safeParse("Password123");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "auth.errors.passwordRequireSymbols"
        );
      }
    });
  });

  describe("Combined Requirements", () => {
    const strictSchema = getPasswordSchema({
      minLength: 12,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
    });

    it("accepts passwords meeting all requirements", () => {
      const validPassword = "StrongP@ss123";
      const result = strictSchema.safeParse(validPassword);
      expect(result.success).toBe(true);
    });

    it("rejects passwords missing uppercase", () => {
      const result = strictSchema.safeParse("strongp@ss123");
      expect(result.success).toBe(false);
    });

    it("rejects passwords missing lowercase", () => {
      const result = strictSchema.safeParse("STRONGP@SS123");
      expect(result.success).toBe(false);
    });

    it("rejects passwords missing numbers", () => {
      const result = strictSchema.safeParse("StrongP@ssword");
      expect(result.success).toBe(false);
    });

    it("rejects passwords missing symbols", () => {
      const result = strictSchema.safeParse("StrongPass1234");
      expect(result.success).toBe(false);
    });

    it("rejects passwords that are too short", () => {
      const result = strictSchema.safeParse("Pass@1");
      expect(result.success).toBe(false);
    });

    it("rejects passwords that are too long", () => {
      const result = strictSchema.safeParse(`P@ss1${"a".repeat(125)}`);
      expect(result.success).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined validation config", () => {
      const schema = getPasswordSchema(undefined);
      const result = schema.safeParse("password");
      expect(result.success).toBe(true);
    });

    it("handles empty validation config", () => {
      const schema = getPasswordSchema({});
      const result = schema.safeParse("password");
      expect(result.success).toBe(true);
    });

    it("handles passwords with spaces", () => {
      const schema = getPasswordSchema();
      const result = schema.safeParse("pass word");
      expect(result.success).toBe(true);
    });

    it("handles passwords with unicode characters", () => {
      const schema = getPasswordSchema();
      const result = schema.safeParse("パスワード123");
      expect(result.success).toBe(true);
    });

    it("handles passwords with emojis", () => {
      const schema = getPasswordSchema();
      const result = schema.safeParse("password🔐");
      expect(result.success).toBe(true);
    });

    it("treats emoji as symbol when requireSymbols is true", () => {
      const schema = getPasswordSchema({ requireSymbols: true });
      const result = schema.safeParse("Password1🔐");
      expect(result.success).toBe(true);
    });
  });

  describe("Multiple Validation Errors", () => {
    const strictSchema = getPasswordSchema({
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true,
    });

    it("reports first failing validation", () => {
      const result = strictSchema.safeParse("short");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
