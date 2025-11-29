/**
 * Builder Configuration State Management
 *
 * Manages the state for the credential login builder UI,
 * allowing users to configure options and see live previews.
 *
 * @module @better-auth-ui/web/builder
 */

import { useCallback, useState } from "react";

// ============================================================================
// Types
// ============================================================================

/**
 * Authentication method for credential-based login
 */
export type AuthMethod = "email" | "username" | "phone";

/**
 * Password validation rules configuration
 */
export type PasswordValidation = {
  /** Minimum password length (default: 8, min: 4, max: 128) */
  minLength: number;
  /** Maximum password length (default: 256, min: 8, max: 256) */
  maxLength: number;
  /** Require at least one uppercase letter */
  requireUppercase: boolean;
  /** Require at least one lowercase letter */
  requireLowercase: boolean;
  /** Require at least one numeric digit */
  requireNumbers: boolean;
  /** Require at least one special character */
  requireSymbols: boolean;
};

/**
 * Builder configuration state for credential login block
 */
export type BuilderConfiguration = {
  /** Selected authentication method */
  authMethod: AuthMethod;
  /** Include remember me checkbox */
  showRememberMe: boolean;
  /** Include forgot password link */
  showForgotPassword: boolean;
  /** Forgot password URL */
  forgotPasswordUrl: string;
  /** Enable client-side validation */
  enableValidation: boolean;
  /** Password validation rules */
  passwordValidation: PasswordValidation;
};

// ============================================================================
// Defaults
// ============================================================================

/**
 * Default password validation configuration
 */
export const DEFAULT_PASSWORD_VALIDATION: PasswordValidation = {
  minLength: 8,
  maxLength: 256,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSymbols: false,
};

/**
 * Default builder configuration
 */
export const DEFAULT_BUILDER_CONFIG: BuilderConfiguration = {
  authMethod: "email",
  showRememberMe: false,
  showForgotPassword: false,
  forgotPasswordUrl: "/auth/forgot-password",
  enableValidation: true,
  passwordValidation: DEFAULT_PASSWORD_VALIDATION,
};

// ============================================================================
// State Management Hook
// ============================================================================

/**
 * Actions for builder state management
 */
export type BuilderActions = {
  /** Set authentication method */
  setAuthMethod: (method: AuthMethod) => void;
  /** Toggle remember me checkbox */
  toggleRememberMe: () => void;
  /** Toggle forgot password link */
  toggleForgotPassword: () => void;
  /** Set forgot password URL */
  setForgotPasswordUrl: (url: string) => void;
  /** Toggle client-side validation */
  toggleValidation: () => void;
  /** Update password validation rules */
  updatePasswordValidation: (updates: Partial<PasswordValidation>) => void;
  /** Reset to default configuration */
  resetConfig: () => void;
  /** Set entire configuration */
  setConfig: (config: BuilderConfiguration) => void;
};

/**
 * Builder state return type
 */
export type BuilderState = {
  /** Current configuration */
  config: BuilderConfiguration;
  /** State actions */
  actions: BuilderActions;
};

/**
 * Custom hook for managing builder configuration state
 *
 * @param initialConfig - Optional initial configuration
 * @returns Builder state and actions
 *
 * @example
 * ```tsx
 * const { config, actions } = useBuilderState();
 *
 * // Update auth method
 * actions.setAuthMethod('username');
 *
 * // Toggle features
 * actions.toggleRememberMe();
 *
 * // Update validation rules
 * actions.updatePasswordValidation({ minLength: 12 });
 * ```
 */
export function useBuilderState(
  initialConfig: Partial<BuilderConfiguration> = {}
): BuilderState {
  const [config, setConfig] = useState<BuilderConfiguration>({
    ...DEFAULT_BUILDER_CONFIG,
    ...initialConfig,
    passwordValidation: {
      ...DEFAULT_PASSWORD_VALIDATION,
      ...initialConfig.passwordValidation,
    },
  });

  const setAuthMethod = useCallback((method: AuthMethod) => {
    setConfig((prev) => ({ ...prev, authMethod: method }));
  }, []);

  const toggleRememberMe = useCallback(() => {
    setConfig((prev) => ({ ...prev, showRememberMe: !prev.showRememberMe }));
  }, []);

  const toggleForgotPassword = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      showForgotPassword: !prev.showForgotPassword,
    }));
  }, []);

  const setForgotPasswordUrl = useCallback((url: string) => {
    setConfig((prev) => ({ ...prev, forgotPasswordUrl: url }));
  }, []);

  const toggleValidation = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      enableValidation: !prev.enableValidation,
    }));
  }, []);

  const updatePasswordValidation = useCallback(
    (updates: Partial<PasswordValidation>) => {
      setConfig((prev) => ({
        ...prev,
        passwordValidation: {
          ...prev.passwordValidation,
          ...updates,
        },
      }));
    },
    []
  );

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_BUILDER_CONFIG);
  }, []);

  const setConfigAction = useCallback((newConfig: BuilderConfiguration) => {
    setConfig(newConfig);
  }, []);

  return {
    config,
    actions: {
      setAuthMethod,
      toggleRememberMe,
      toggleForgotPassword,
      setForgotPasswordUrl,
      toggleValidation,
      updatePasswordValidation,
      resetConfig,
      setConfig: setConfigAction,
    },
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate shadcn CLI installation command
 */
export function generateShadcnCommand(registryUrl: string): string {
  return `npx shadcn@latest add "${registryUrl}"`;
}

/**
 * Generate npm package installation command
 */
export function generateNpmCommand(): string {
  return "pnpm add @better-auth-ui/components";
}

/**
 * Generate component usage code based on configuration
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Code generation logic is complex
export function generateUsageCode(config: BuilderConfiguration): string {
  const props: string[] = [
    `authMethod="${config.authMethod}"`,
    "authClient={authClient}",
  ];

  if (config.showRememberMe) {
    props.push("showRememberMe={true}");
  }

  if (config.showForgotPassword) {
    props.push("showForgotPassword={true}");
    if (config.forgotPasswordUrl !== "/auth/forgot-password") {
      props.push(`forgotPasswordUrl="${config.forgotPasswordUrl}"`);
    }
  }

  if (config.enableValidation) {
    const validation = config.passwordValidation;
    const hasCustomValidation =
      validation.minLength !== 8 ||
      validation.requireUppercase ||
      validation.requireLowercase ||
      validation.requireNumbers ||
      validation.requireSymbols;

    if (hasCustomValidation) {
      const validationProps: string[] = [];
      if (validation.minLength !== 8) {
        validationProps.push(`minLength: ${validation.minLength}`);
      }
      if (validation.requireUppercase) {
        validationProps.push("requireUppercase: true");
      }
      if (validation.requireLowercase) {
        validationProps.push("requireLowercase: true");
      }
      if (validation.requireNumbers) {
        validationProps.push("requireNumbers: true");
      }
      if (validation.requireSymbols) {
        validationProps.push("requireSymbols: true");
      }

      props.push(`passwordValidation={{
    ${validationProps.join(",\n    ")}
  }}`);
    }
  } else {
    props.push("enableClientValidation={false}");
  }

  props.push('onSuccess={() => router.push("/dashboard")}');

  return `import { CredentialLoginForm } from '@better-auth-ui/components'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  return (
    <CredentialLoginForm
      ${props.join("\n      ")}
    />
  )
}`;
}

/**
 * Get label for auth method
 */
export function getAuthMethodLabel(method: AuthMethod): string {
  switch (method) {
    case "email":
      return "Email";
    case "username":
      return "Username";
    case "phone":
      return "Phone Number";
    default:
      return method;
  }
}
