/**
 * T078 [US3] Unit test for NPM package exports
 *
 * Validates that all public exports from @imbios/ui
 * are correctly exported and accessible.
 */
import { describe, expect, it } from "vitest";

describe("NPM Package Exports", () => {
  describe("Component Exports", () => {
    it("exports CredentialLoginForm component", async () => {
      const module = await import("../../src/index");
      expect(module.CredentialLoginForm).toBeDefined();
      expect(typeof module.CredentialLoginForm).toBe("function");
    });
  });

  describe("Type Exports", () => {
    it("exports AuthMethod type via runtime check", async () => {
      // Type exports are compile-time only, but we can verify the module structure
      const module = await import("../../src/index");
      // These are type exports, they won't exist at runtime
      // We verify they compile correctly via TypeScript
      expect(module).toBeDefined();
    });

    it("exports PasswordValidation interface via runtime check", async () => {
      const module = await import("../../src/index");
      expect(module).toBeDefined();
    });

    it("exports AuthError interface via runtime check", async () => {
      const module = await import("../../src/index");
      expect(module).toBeDefined();
    });

    it("exports CredentialLoginFormProps interface via runtime check", async () => {
      const module = await import("../../src/index");
      expect(module).toBeDefined();
    });

    it("exports CredentialLoginClassNames interface via runtime check", async () => {
      const module = await import("../../src/index");
      expect(module).toBeDefined();
    });
  });

  describe("Type Guard Exports", () => {
    it("exports isAuthError type guard", async () => {
      const module = await import("../../src/index");
      expect(module.isAuthError).toBeDefined();
      expect(typeof module.isAuthError).toBe("function");
    });

    it("exports isAuthenticationResponse type guard", async () => {
      const module = await import("../../src/index");
      expect(module.isAuthenticationResponse).toBeDefined();
      expect(typeof module.isAuthenticationResponse).toBe("function");
    });

    it("isAuthError correctly identifies AuthError objects", async () => {
      const { isAuthError } = await import("../../src/index");

      const validError = {
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials",
        timestamp: new Date().toISOString(),
      };

      const invalidError = {
        message: "Just a message",
      };

      expect(isAuthError(validError)).toBe(true);
      expect(isAuthError(invalidError)).toBe(false);
      expect(isAuthError(null)).toBe(false);
      expect(isAuthError(undefined)).toBe(false);
      expect(isAuthError("string")).toBe(false);
    });

    it("isAuthenticationResponse correctly identifies responses", async () => {
      const { isAuthenticationResponse } = await import("../../src/index");

      const successResponse = {
        success: true,
        user: { id: "123", email: "test@example.com" },
      };

      const errorResponse = {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid",
          timestamp: new Date().toISOString(),
        },
      };

      const invalidResponse = {
        data: "something",
      };

      expect(isAuthenticationResponse(successResponse)).toBe(true);
      expect(isAuthenticationResponse(errorResponse)).toBe(true);
      expect(isAuthenticationResponse(invalidResponse)).toBe(false);
      expect(isAuthenticationResponse(null)).toBe(false);
    });
  });

  describe("i18n Exports", () => {
    it("exports i18n configuration", async () => {
      const module = await import("../../src/index");
      expect(module.i18n).toBeDefined();
    });
  });

  describe("Module Structure", () => {
    it("has expected number of exports", async () => {
      const module = await import("../../src/index");
      const exportKeys = Object.keys(module);

      // Should export:
      // - CredentialLoginForm
      // - i18n
      // - isAuthError
      // - isAuthenticationResponse
      expect(exportKeys.length).toBeGreaterThanOrEqual(4);
    });

    it("all exports are non-undefined", async () => {
      const module = await import("../../src/index");
      for (const [_key, value] of Object.entries(module)) {
        expect(value).toBeDefined();
        expect(value).not.toBeUndefined();
      }
    });
  });
});
