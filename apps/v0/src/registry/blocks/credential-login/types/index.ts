/**
 * Component Props Contract
 *
 * TypeScript interfaces for the @imbios/ui NPM package.
 * These types define the public API for authentication block components.
 *
 * @module @imbios/ui
 * @version 0.1.0
 */

import type { AuthClient } from "better-auth/client";

// ============================================================================
// Core Types
// ============================================================================

/**
 * Authentication method for credential-based login
 */
export type AuthMethod = "email" | "username" | "phone";

/**
 * Authentication error codes returned by better-auth API
 */
export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "USER_NOT_FOUND"
  | "ACCOUNT_LOCKED"
  | "RATE_LIMIT_EXCEEDED"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "TWO_FACTOR_REQUIRED";

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Authentication error details
 */
export type AuthError = {
  /** Error classification code */
  code: AuthErrorCode;
  /** User-friendly localized error message */
  message: string;
  /** Field that caused the error (if applicable) */
  field?: "identifier" | "password";
  /** Error occurrence timestamp (ISO 8601) */
  timestamp: string;
};

/**
 * Authentication API response
 */
export type AuthenticationResponse = {
  /** Whether authentication was successful */
  success: boolean;
  /** User object (present on success) */
  user?: {
    id: string;
    email?: string;
    username?: string;
    phoneNumber?: string;
    name?: string;
    image?: string;
  };
  /** Session object (present on success) */
  session?: {
    token: string;
    expiresAt: string;
  };
  /** Indicates if two-factor authentication is required */
  twoFactorRedirect?: boolean;
  /** Error details (present on failure) */
  error?: AuthError;
};

// ============================================================================
// Validation
// ============================================================================

/**
 * Password validation rules
 */
export type PasswordValidation = {
  /** Minimum password length (default: 8, min: 4, max: 128) */
  minLength?: number;
  /** Maximum password length (default: 256, min: 8, max: 256) */
  maxLength?: number;
  /** Require at least one uppercase letter (default: false) */
  requireUppercase?: boolean;
  /** Require at least one lowercase letter (default: false) */
  requireLowercase?: boolean;
  /** Require at least one numeric digit (default: false) */
  requireNumbers?: boolean;
  /** Require at least one special character (default: false) */
  requireSymbols?: boolean;
};

// ============================================================================
// Styling
// ============================================================================

/**
 * CSS class names for styling sub-elements
 */
export type CredentialLoginClassNames = {
  /** Form container class */
  form?: string;
  /** Input field class */
  input?: string;
  /** Label class */
  label?: string;
  /** Primary button class */
  button?: string;
  /** Error message class */
  error?: string;
  /** Card container class (if using card layout) */
  card?: string;
  /** Checkbox class (for remember me) */
  checkbox?: string;
  /** Link class (for forgot password) */
  link?: string;
};

// ============================================================================
// Main Component Props
// ============================================================================

/**
 * Props for the CredentialLoginForm component
 *
 * @example
 * ```tsx
 * import { CredentialLoginForm } from '@imbios/ui'
 * import { authClient } from '@/lib/auth-client'
 *
 * export function SignInPage() {
 *   return (
 *     <CredentialLoginForm
 *       authMethod="email"
 *       authClient={authClient}
 *       showRememberMe={true}
 *       showForgotPassword={true}
 *       onSuccess={() => router.push('/dashboard')}
 *     />
 *   )
 * }
 * ```
 */
export type CredentialLoginFormProps = {
  // -------------------------------------------------------------------------
  // Required Configuration
  // -------------------------------------------------------------------------

  /**
   * Primary authentication method
   * - 'email': Email address authentication
   * - 'username': Username authentication
   * - 'phone': Phone number authentication (E.164 format)
   */
  authMethod: AuthMethod;

  /**
   * better-auth client instance for API calls
   *
   * @see https://better-auth.com/docs/api/client
   */
  authClient: AuthClient;

  // -------------------------------------------------------------------------
  // Optional Features
  // -------------------------------------------------------------------------

  /**
   * Show "Remember me" checkbox
   * @default false
   */
  showRememberMe?: boolean;

  /**
   * Show "Forgot password?" link
   * @default false
   */
  showForgotPassword?: boolean;

  /**
   * URL for forgot password page
   * @default "/auth/forgot-password"
   */
  forgotPasswordUrl?: string;

  // -------------------------------------------------------------------------
  // Validation Configuration
  // -------------------------------------------------------------------------

  /**
   * Enable client-side validation
   * @default true
   */
  enableClientValidation?: boolean;

  /**
   * Password validation rules
   * @default { minLength: 8, maxLength: 256 }
   */
  passwordValidation?: PasswordValidation;

  // -------------------------------------------------------------------------
  // Callbacks
  // -------------------------------------------------------------------------

  /**
   * Called on successful authentication (before redirect)
   * Use for analytics, state updates, or custom navigation
   */
  onSuccess?: () => void | Promise<void>;

  /**
   * Called when authentication fails
   * Use for custom error handling or logging
   */
  onError?: (error: AuthError) => void;

  /**
   * URL to redirect to after successful authentication
   * @default undefined (no automatic redirect, rely on onSuccess)
   */
  redirectTo?: string;

  // -------------------------------------------------------------------------
  // Styling
  // -------------------------------------------------------------------------

  /**
   * CSS class for the root container
   */
  className?: string;

  /**
   * CSS classes for sub-elements
   */
  classNames?: CredentialLoginClassNames;

  // -------------------------------------------------------------------------
  // Advanced
  // -------------------------------------------------------------------------

  /**
   * Custom loading spinner component
   * @default <Spinner /> (from lucide-react)
   */
  loadingComponent?: React.ComponentType;

  /**
   * Disable the form (external control)
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom error message renderer
   * @default Built-in error display
   */
  errorRenderer?: (error: AuthError) => React.ReactNode;
};

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value is an AuthError
 */
export function isAuthError(value: unknown): value is AuthError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    "timestamp" in value
  );
}

/**
 * Type guard to check if a value is an AuthenticationResponse
 */
export function isAuthenticationResponse(
  value: unknown
): value is AuthenticationResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof (value as AuthenticationResponse).success === "boolean"
  );
}
