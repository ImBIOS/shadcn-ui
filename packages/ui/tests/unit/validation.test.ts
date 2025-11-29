/**
 * Unit tests for form validation (email/username/phone formats)
 * @module tests/unit/validation
 */

import { describe, expect, it } from "vitest";
import {
  emailCredentialSchema,
  phoneCredentialSchema,
  usernameCredentialSchema,
} from "../../src/lib/validation/index";

describe("Form Validation Schemas", () => {
  describe("Email Credential Schema", () => {
    it("accepts valid email addresses", () => {
      const validEmails = [
        "user@example.com",
        "user.name@example.com",
        "user+tag@example.com",
        "user@subdomain.example.com",
        "user@example.co.uk",
        "USER@EXAMPLE.COM",
      ];

      for (const email of validEmails) {
        const result = emailCredentialSchema.safeParse({
          identifier: email,
          password: "password123",
        });
        expect(result.success, `Expected ${email} to be valid`).toBe(true);
      }
    });

    it("rejects invalid email addresses", () => {
      const invalidEmails = [
        "",
        "user",
        "user@",
        "@example.com",
        "user@.com",
        "user@example",
        "user @example.com",
        "user@example .com",
        "user@@example.com",
      ];

      for (const email of invalidEmails) {
        const result = emailCredentialSchema.safeParse({
          identifier: email,
          password: "password123",
        });
        expect(result.success, `Expected ${email} to be invalid`).toBe(false);
      }
    });

    it("requires identifier field", () => {
      const result = emailCredentialSchema.safeParse({
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("requires password field", () => {
      const result = emailCredentialSchema.safeParse({
        identifier: "user@example.com",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Username Credential Schema", () => {
    it("accepts valid usernames", () => {
      const validUsernames = [
        "abc", // Minimum length 3
        "user",
        "user123",
        "user_name",
        "user-name",
        "User123",
        "USER_NAME-123",
        "a".repeat(30), // Maximum length 30
      ];

      for (const username of validUsernames) {
        const result = usernameCredentialSchema.safeParse({
          identifier: username,
          password: "password123",
        });
        expect(result.success, `Expected ${username} to be valid`).toBe(true);
      }
    });

    it("rejects usernames shorter than 3 characters", () => {
      const result = usernameCredentialSchema.safeParse({
        identifier: "ab",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "auth.errors.invalidUsername"
        );
      }
    });

    it("rejects usernames longer than 30 characters", () => {
      const result = usernameCredentialSchema.safeParse({
        identifier: "a".repeat(31),
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          "auth.errors.invalidUsername"
        );
      }
    });

    it("rejects usernames with invalid characters", () => {
      const invalidUsernames = [
        "user@name",
        "user.name",
        "user name",
        "user!name",
        "user#name",
        "user$name",
        "user%name",
        "user&name",
        "user*name",
      ];

      for (const username of invalidUsernames) {
        const result = usernameCredentialSchema.safeParse({
          identifier: username,
          password: "password123",
        });
        expect(result.success, `Expected ${username} to be invalid`).toBe(
          false
        );
      }
    });

    it("rejects empty username", () => {
      const result = usernameCredentialSchema.safeParse({
        identifier: "",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Phone Credential Schema", () => {
    it("accepts valid E.164 phone numbers", () => {
      const validPhones = [
        "+12025551234", // US
        "+442071234567", // UK
        "+33123456789", // France
        "+491511234567", // Germany
        "+81312345678", // Japan
        "+8613812345678", // China
        "+919876543210", // India
        "12025551234", // Without + prefix (allowed)
      ];

      for (const phone of validPhones) {
        const result = phoneCredentialSchema.safeParse({
          identifier: phone,
          password: "password123",
        });
        expect(result.success, `Expected ${phone} to be valid`).toBe(true);
      }
    });

    it("rejects invalid phone numbers", () => {
      const invalidPhones = [
        "",
        "phone",
        "+0123456789", // Cannot start with 0
        "02025551234", // Cannot start with 0
        "+1-202-555-1234", // No dashes
        "+1 202 555 1234", // No spaces
        "(202) 555-1234", // No parentheses
        "+1234567890123456", // Too long (>15 digits)
      ];

      for (const phone of invalidPhones) {
        const result = phoneCredentialSchema.safeParse({
          identifier: phone,
          password: "password123",
        });
        expect(result.success, `Expected ${phone} to be invalid`).toBe(false);
      }
    });

    it("rejects phone numbers starting with 0 after +", () => {
      const result = phoneCredentialSchema.safeParse({
        identifier: "+01234567890",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects phone numbers with letters", () => {
      const result = phoneCredentialSchema.safeParse({
        identifier: "+1202555CALL",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Password Field Validation", () => {
    it("requires password to be non-empty", () => {
      const result = emailCredentialSchema.safeParse({
        identifier: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });

    it("accepts passwords with various characters", () => {
      const validPasswords = [
        "simple",
        "Password123",
        "p@ssw0rd!",
        "a".repeat(256), // Long password
        "日本語パスワード", // Unicode
        "   spaces   ", // Spaces allowed
      ];

      for (const password of validPasswords) {
        const result = emailCredentialSchema.safeParse({
          identifier: "user@example.com",
          password,
        });
        expect(
          result.success,
          `Expected password "${password}" to be valid`
        ).toBe(true);
      }
    });
  });

  describe("RememberMe Field Validation", () => {
    it("accepts boolean rememberMe field", () => {
      const resultTrue = emailCredentialSchema.safeParse({
        identifier: "user@example.com",
        password: "password123",
        rememberMe: true,
      });
      expect(resultTrue.success).toBe(true);

      const resultFalse = emailCredentialSchema.safeParse({
        identifier: "user@example.com",
        password: "password123",
        rememberMe: false,
      });
      expect(resultFalse.success).toBe(true);
    });

    it("keeps rememberMe as undefined when not provided", () => {
      const result = emailCredentialSchema.safeParse({
        identifier: "user@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        // rememberMe is optional, so it's undefined when not provided
        expect(result.data.rememberMe).toBeUndefined();
      }
    });
  });

  describe("Schema Type Safety", () => {
    it("returns properly typed data on successful parse", () => {
      const result = emailCredentialSchema.safeParse({
        identifier: "user@example.com",
        password: "password123",
        rememberMe: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          identifier: "user@example.com",
          password: "password123",
          rememberMe: true,
        });
      }
    });

    it("strips unknown fields", () => {
      const result = emailCredentialSchema.safeParse({
        identifier: "user@example.com",
        password: "password123",
        unknownField: "should be stripped",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect("unknownField" in result.data).toBe(false);
      }
    });
  });
});
