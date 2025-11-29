/**
 * Unit tests for BuilderConfiguration state management
 *
 * @module tests/unit/builder-state.test.ts
 * Task: T058 [US2] Unit test for BuilderConfiguration state management
 */

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BuilderConfiguration } from "@/lib/builder/builder-state";
import {
  DEFAULT_BUILDER_CONFIG,
  DEFAULT_PASSWORD_VALIDATION,
  generateNpmCommand,
  generateShadcnCommand,
  generateUsageCode,
  getAuthMethodLabel,
  useBuilderState,
} from "@/lib/builder/builder-state";

describe("BuilderConfiguration State Management", () => {
  describe("useBuilderState hook", () => {
    describe("Initialization", () => {
      it("initializes with default configuration", () => {
        const { result } = renderHook(() => useBuilderState());

        expect(result.current.config).toEqual(DEFAULT_BUILDER_CONFIG);
      });

      it("initializes with custom configuration", () => {
        const customConfig: Partial<BuilderConfiguration> = {
          authMethod: "username",
          showRememberMe: true,
        };

        const { result } = renderHook(() => useBuilderState(customConfig));

        expect(result.current.config.authMethod).toBe("username");
        expect(result.current.config.showRememberMe).toBe(true);
        // Other fields should be defaults
        expect(result.current.config.showForgotPassword).toBe(false);
      });

      it("merges custom password validation with defaults", () => {
        const customConfig: Partial<BuilderConfiguration> = {
          passwordValidation: {
            ...DEFAULT_PASSWORD_VALIDATION,
            minLength: 12,
            requireUppercase: true,
          },
        };

        const { result } = renderHook(() => useBuilderState(customConfig));

        expect(result.current.config.passwordValidation.minLength).toBe(12);
        expect(result.current.config.passwordValidation.requireUppercase).toBe(
          true
        );
        // Other validation fields should be defaults
        expect(result.current.config.passwordValidation.requireNumbers).toBe(
          false
        );
      });
    });

    describe("Auth Method", () => {
      it("updates authMethod to email", () => {
        const { result } = renderHook(() =>
          useBuilderState({ authMethod: "username" })
        );

        act(() => {
          result.current.actions.setAuthMethod("email");
        });

        expect(result.current.config.authMethod).toBe("email");
      });

      it("updates authMethod to username", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.setAuthMethod("username");
        });

        expect(result.current.config.authMethod).toBe("username");
      });

      it("updates authMethod to phone", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.setAuthMethod("phone");
        });

        expect(result.current.config.authMethod).toBe("phone");
      });
    });

    describe("Remember Me Toggle", () => {
      it("toggles showRememberMe from false to true", () => {
        const { result } = renderHook(() => useBuilderState());

        expect(result.current.config.showRememberMe).toBe(false);

        act(() => {
          result.current.actions.toggleRememberMe();
        });

        expect(result.current.config.showRememberMe).toBe(true);
      });

      it("toggles showRememberMe from true to false", () => {
        const { result } = renderHook(() =>
          useBuilderState({ showRememberMe: true })
        );

        expect(result.current.config.showRememberMe).toBe(true);

        act(() => {
          result.current.actions.toggleRememberMe();
        });

        expect(result.current.config.showRememberMe).toBe(false);
      });
    });

    describe("Forgot Password Toggle", () => {
      it("toggles showForgotPassword from false to true", () => {
        const { result } = renderHook(() => useBuilderState());

        expect(result.current.config.showForgotPassword).toBe(false);

        act(() => {
          result.current.actions.toggleForgotPassword();
        });

        expect(result.current.config.showForgotPassword).toBe(true);
      });

      it("toggles showForgotPassword from true to false", () => {
        const { result } = renderHook(() =>
          useBuilderState({ showForgotPassword: true })
        );

        act(() => {
          result.current.actions.toggleForgotPassword();
        });

        expect(result.current.config.showForgotPassword).toBe(false);
      });

      it("updates forgot password URL", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.setForgotPasswordUrl("/reset-password");
        });

        expect(result.current.config.forgotPasswordUrl).toBe("/reset-password");
      });
    });

    describe("Validation Toggle", () => {
      it("toggles enableValidation from true to false", () => {
        const { result } = renderHook(() => useBuilderState());

        expect(result.current.config.enableValidation).toBe(true);

        act(() => {
          result.current.actions.toggleValidation();
        });

        expect(result.current.config.enableValidation).toBe(false);
      });

      it("toggles enableValidation from false to true", () => {
        const { result } = renderHook(() =>
          useBuilderState({ enableValidation: false })
        );

        act(() => {
          result.current.actions.toggleValidation();
        });

        expect(result.current.config.enableValidation).toBe(true);
      });
    });

    describe("Password Validation Updates", () => {
      it("updates minLength", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.updatePasswordValidation({ minLength: 12 });
        });

        expect(result.current.config.passwordValidation.minLength).toBe(12);
      });

      it("updates maxLength", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.updatePasswordValidation({ maxLength: 128 });
        });

        expect(result.current.config.passwordValidation.maxLength).toBe(128);
      });

      it("updates requireUppercase", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.updatePasswordValidation({
            requireUppercase: true,
          });
        });

        expect(result.current.config.passwordValidation.requireUppercase).toBe(
          true
        );
      });

      it("updates requireLowercase", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.updatePasswordValidation({
            requireLowercase: true,
          });
        });

        expect(result.current.config.passwordValidation.requireLowercase).toBe(
          true
        );
      });

      it("updates requireNumbers", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.updatePasswordValidation({
            requireNumbers: true,
          });
        });

        expect(result.current.config.passwordValidation.requireNumbers).toBe(
          true
        );
      });

      it("updates requireSymbols", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.updatePasswordValidation({
            requireSymbols: true,
          });
        });

        expect(result.current.config.passwordValidation.requireSymbols).toBe(
          true
        );
      });

      it("updates multiple validation fields at once", () => {
        const { result } = renderHook(() => useBuilderState());

        act(() => {
          result.current.actions.updatePasswordValidation({
            minLength: 16,
            requireUppercase: true,
            requireNumbers: true,
          });
        });

        expect(result.current.config.passwordValidation.minLength).toBe(16);
        expect(result.current.config.passwordValidation.requireUppercase).toBe(
          true
        );
        expect(result.current.config.passwordValidation.requireNumbers).toBe(
          true
        );
        // Other fields unchanged
        expect(result.current.config.passwordValidation.requireLowercase).toBe(
          false
        );
      });
    });

    describe("Config Reset", () => {
      it("resets configuration to defaults", () => {
        const { result } = renderHook(() =>
          useBuilderState({
            authMethod: "phone",
            showRememberMe: true,
            showForgotPassword: true,
            passwordValidation: {
              ...DEFAULT_PASSWORD_VALIDATION,
              minLength: 20,
              requireSymbols: true,
            },
          })
        );

        // Verify custom config is applied
        expect(result.current.config.authMethod).toBe("phone");
        expect(result.current.config.showRememberMe).toBe(true);

        act(() => {
          result.current.actions.resetConfig();
        });

        expect(result.current.config).toEqual(DEFAULT_BUILDER_CONFIG);
      });
    });

    describe("Set Config", () => {
      it("sets entire configuration", () => {
        const { result } = renderHook(() => useBuilderState());

        const newConfig: BuilderConfiguration = {
          authMethod: "phone",
          showRememberMe: true,
          showForgotPassword: true,
          forgotPasswordUrl: "/custom-reset",
          enableValidation: false,
          passwordValidation: {
            minLength: 10,
            maxLength: 100,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true,
          },
        };

        act(() => {
          result.current.actions.setConfig(newConfig);
        });

        expect(result.current.config).toEqual(newConfig);
      });
    });

    describe("State Stability", () => {
      it("action functions remain stable across renders", () => {
        const { result, rerender } = renderHook(() => useBuilderState());

        const initialActions = result.current.actions;

        rerender();

        expect(result.current.actions.setAuthMethod).toBe(
          initialActions.setAuthMethod
        );
        expect(result.current.actions.toggleRememberMe).toBe(
          initialActions.toggleRememberMe
        );
        expect(result.current.actions.toggleForgotPassword).toBe(
          initialActions.toggleForgotPassword
        );
        expect(result.current.actions.updatePasswordValidation).toBe(
          initialActions.updatePasswordValidation
        );
        expect(result.current.actions.resetConfig).toBe(
          initialActions.resetConfig
        );
      });
    });
  });

  describe("Utility Functions", () => {
    describe("generateShadcnCommand", () => {
      it("generates correct shadcn CLI command", () => {
        const url = "https://better-auth-ui.com/r/credential-login";
        const command = generateShadcnCommand(url);

        expect(command).toBe(
          'npx shadcn@latest add "https://better-auth-ui.com/r/credential-login"'
        );
      });
    });

    describe("generateNpmCommand", () => {
      it("generates correct npm install command", () => {
        const command = generateNpmCommand();

        expect(command).toBe("pnpm add @better-auth-ui/components");
      });
    });

    describe("generateUsageCode", () => {
      it("generates minimal code for default config", () => {
        const code = generateUsageCode(DEFAULT_BUILDER_CONFIG);

        expect(code).toContain('authMethod="email"');
        expect(code).toContain("authClient={authClient}");
        expect(code).not.toContain("showRememberMe");
        expect(code).not.toContain("showForgotPassword");
        expect(code).not.toContain("passwordValidation");
      });

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

      it("includes passwordValidation when customized", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          passwordValidation: {
            ...DEFAULT_PASSWORD_VALIDATION,
            minLength: 12,
            requireUppercase: true,
          },
        };

        const code = generateUsageCode(config);

        expect(code).toContain("passwordValidation={{");
        expect(code).toContain("minLength: 12");
        expect(code).toContain("requireUppercase: true");
      });

      it("excludes passwordValidation when using defaults", () => {
        const code = generateUsageCode(DEFAULT_BUILDER_CONFIG);

        expect(code).not.toContain("passwordValidation");
      });

      it("includes enableClientValidation=false when disabled", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          enableValidation: false,
        };

        const code = generateUsageCode(config);

        expect(code).toContain("enableClientValidation={false}");
      });

      it("generates code for username auth method", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          authMethod: "username",
        };

        const code = generateUsageCode(config);

        expect(code).toContain('authMethod="username"');
      });

      it("generates code for phone auth method", () => {
        const config: BuilderConfiguration = {
          ...DEFAULT_BUILDER_CONFIG,
          authMethod: "phone",
        };

        const code = generateUsageCode(config);

        expect(code).toContain('authMethod="phone"');
      });

      it("generates complete code with all options enabled", () => {
        const config: BuilderConfiguration = {
          authMethod: "email",
          showRememberMe: true,
          showForgotPassword: true,
          forgotPasswordUrl: "/reset",
          enableValidation: true,
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

        expect(code).toContain("showRememberMe={true}");
        expect(code).toContain("showForgotPassword={true}");
        expect(code).toContain('forgotPasswordUrl="/reset"');
        expect(code).toContain("minLength: 16");
        expect(code).toContain("requireUppercase: true");
        expect(code).toContain("requireLowercase: true");
        expect(code).toContain("requireNumbers: true");
        expect(code).toContain("requireSymbols: true");
      });
    });

    describe("getAuthMethodLabel", () => {
      it("returns correct label for email", () => {
        expect(getAuthMethodLabel("email")).toBe("Email");
      });

      it("returns correct label for username", () => {
        expect(getAuthMethodLabel("username")).toBe("Username");
      });

      it("returns correct label for phone", () => {
        expect(getAuthMethodLabel("phone")).toBe("Phone Number");
      });
    });
  });

  describe("Default Values", () => {
    it("DEFAULT_PASSWORD_VALIDATION has correct values", () => {
      expect(DEFAULT_PASSWORD_VALIDATION).toEqual({
        minLength: 8,
        maxLength: 256,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
      });
    });

    it("DEFAULT_BUILDER_CONFIG has correct values", () => {
      expect(DEFAULT_BUILDER_CONFIG).toEqual({
        authMethod: "email",
        showRememberMe: false,
        showForgotPassword: false,
        forgotPasswordUrl: "/auth/forgot-password",
        enableValidation: true,
        passwordValidation: DEFAULT_PASSWORD_VALIDATION,
      });
    });
  });
});
