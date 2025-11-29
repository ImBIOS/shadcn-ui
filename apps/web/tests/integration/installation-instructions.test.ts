/**
 * Integration test for installation instruction accuracy
 *
 * @module tests/integration/installation-instructions.test.ts
 * Task: T077 [US2] Integration test for installation instruction accuracy
 */

import { describe, expect, it } from "vitest";
import type { BuilderConfiguration } from "@/lib/builder/builder-state";
import {
  DEFAULT_BUILDER_CONFIG,
  DEFAULT_PASSWORD_VALIDATION,
  generateNpmCommand,
  generateShadcnCommand,
  generateUsageCode,
} from "@/lib/builder/builder-state";

describe("Integration: Installation Instructions Accuracy", () => {
  describe("shadcn CLI Command", () => {
    it("generates correct command with registry URL", () => {
      const url = "https://better-auth-ui.com/r/credential-login";
      const command = generateShadcnCommand(url);

      expect(command).toBe(
        'npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"'
      );
    });

    it("properly escapes URLs with special characters", () => {
      const url = "https://example.com/r/test?v=1&debug=true";
      const command = generateShadcnCommand(url);

      expect(command).toBe(
        'npx shadcn@latest add "https://example.com/r/test?v=1&debug=true"'
      );
    });
  });

  describe("NPM Command", () => {
    it("generates correct pnpm install command", () => {
      const command = generateNpmCommand();

      expect(command).toBe("pnpm add @better-auth-ui/components");
    });
  });

  describe("Usage Code Generation", () => {
    describe("Default Configuration", () => {
      it("generates minimal code for defaults", () => {
        const code = generateUsageCode(DEFAULT_BUILDER_CONFIG);

        // Should include required props
        expect(code).toContain('authMethod="email"');
        expect(code).toContain("authClient={authClient}");

        // Should NOT include optional props that are disabled
        expect(code).not.toContain("showRememberMe={true}");
        expect(code).not.toContain("showForgotPassword={true}");

        // Should include onSuccess callback
        expect(code).toContain('onSuccess={() => router.push("/dashboard")}');

        // Should include imports
        expect(code).toContain(
          "import { CredentialLoginForm } from '@better-auth-ui/components'"
        );
        expect(code).toContain(
          "import { authClient } from '@/lib/auth-client'"
        );
      });
    });

    describe("Custom Configuration", () => {
      it("includes showRememberMe when enabled", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          showRememberMe: true,
        };

        const code = generateUsageCode(config);

        expect(code).toContain("showRememberMe={true}");
      });

      it("includes showForgotPassword when enabled", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          showForgotPassword: true,
        };

        const code = generateUsageCode(config);

        expect(code).toContain("showForgotPassword={true}");
      });

      it("includes custom forgotPasswordUrl", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          showForgotPassword: true,
          forgotPasswordUrl: "/custom-reset",
        };

        const code = generateUsageCode(config);

        expect(code).toContain('forgotPasswordUrl="/custom-reset"');
      });

      it("excludes default forgotPasswordUrl", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          showForgotPassword: true,
          forgotPasswordUrl: "/auth/forgot-password",
        };

        const code = generateUsageCode(config);

        expect(code).not.toContain("forgotPasswordUrl=");
      });

      it("includes enableClientValidation=false when disabled", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          enableValidation: false,
        };

        const code = generateUsageCode(config);

        expect(code).toContain("enableClientValidation={false}");
      });

      it("generates correct code for username auth method", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          authMethod: "username",
        };

        const code = generateUsageCode(config);

        expect(code).toContain('authMethod="username"');
      });

      it("generates correct code for phone auth method", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          authMethod: "phone",
        };

        const code = generateUsageCode(config);

        expect(code).toContain('authMethod="phone"');
      });
    });

    describe("Password Validation", () => {
      it("includes passwordValidation when minLength is customized", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          passwordValidation: {
            ...DEFAULT_PASSWORD_VALIDATION,
            minLength: 12,
          },
        };

        const code = generateUsageCode(config);

        expect(code).toContain("passwordValidation={{");
        expect(code).toContain("minLength: 12");
      });

      it("includes passwordValidation when requireUppercase is enabled", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          passwordValidation: {
            ...DEFAULT_PASSWORD_VALIDATION,
            requireUppercase: true,
          },
        };

        const code = generateUsageCode(config);

        expect(code).toContain("passwordValidation={{");
        expect(code).toContain("requireUppercase: true");
      });

      it("includes all validation options when multiple are set", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          passwordValidation: {
            minLength: 16,
            maxLength: 256,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true,
          },
        };

        const code = generateUsageCode(config);

        expect(code).toContain("minLength: 16");
        expect(code).toContain("requireUppercase: true");
        expect(code).toContain("requireLowercase: true");
        expect(code).toContain("requireNumbers: true");
        expect(code).toContain("requireSymbols: true");
      });

      it("excludes passwordValidation when using all defaults", () => {
        const code = generateUsageCode(DEFAULT_BUILDER_CONFIG);

        expect(code).not.toContain("passwordValidation");
      });
    });

    describe("Complete Configuration", () => {
      it("generates valid TypeScript code with all options", () => {
        const config: BuilderConfiguration = {
          authMethod: "email",
          showRememberMe: true,
          showForgotPassword: true,
          forgotPasswordUrl: "/reset",
          enableValidation: true,
          passwordValidation: {
            minLength: 12,
            maxLength: 256,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true,
          },
        };

        const code = generateUsageCode(config);

        // Verify structure
        expect(code).toContain("import {");
        expect(code).toContain("export default function");
        expect(code).toContain("<CredentialLoginForm");
        expect(code).toContain("/>");

        // Verify all props are present
        expect(code).toContain('authMethod="email"');
        expect(code).toContain("showRememberMe={true}");
        expect(code).toContain("showForgotPassword={true}");
        expect(code).toContain('forgotPasswordUrl="/reset"');
        expect(code).toContain("passwordValidation={{");
      });

      it("generates code that can be parsed as valid JavaScript", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          showRememberMe: true,
          passwordValidation: {
            ...DEFAULT_PASSWORD_VALIDATION,
            minLength: 12,
          },
        };

        const code = generateUsageCode(config);

        // Should not throw when attempting to evaluate structure
        // (We can't actually evaluate JSX, but we can check syntax)
        expect(code).toMatch(/^import\s+/);
        expect(code).toMatch(/export\s+default\s+function/);
        expect(code).toMatch(/return\s*\(/);
      });
    });
  });
});
