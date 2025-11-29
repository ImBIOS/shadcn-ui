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
// Builder UI Types (Internal)
// ============================================================================

/**
 * Builder configuration state (for documentation site builder UI)
 * @internal
 */
export type BuilderConfiguration = {
  /** Unique configuration ID */
  id: string;
  /** Associated block name */
  blockName: string;
  /** Selected authentication method */
  authMethod: AuthMethod;
  /** Include remember me checkbox */
  showRememberMe: boolean;
  /** Include forgot password link */
  showForgotPassword: boolean;
  /** Enable client-side validation */
  enableValidation: boolean;
  /** Password validation rules */
  passwordValidation?: PasswordValidation;
  /** Configuration creation timestamp */
  createdAt: string;
  /** Last modification timestamp */
  updatedAt: string;
};

// ============================================================================
// Registry Types
// ============================================================================

/**
 * Registry file metadata
 */
export type RegistryFile = {
  /** Source path in registry */
  path: string;
  /** File type classification */
  type:
    | "registry:component"
    | "registry:page"
    | "registry:lib"
    | "registry:file";
  /** Suggested installation path in user's project */
  target?: string;
  /** File source code content */
  content?: string;
};

/**
 * Registry item metadata (follows shadcn schema)
 */
export type RegistryItem = {
  /** Unique identifier (kebab-case) */
  name: string;
  /** Registry item type */
  type:
    | "registry:block"
    | "registry:component"
    | "registry:page"
    | "registry:lib";
  /** Display title */
  title?: string;
  /** Short description */
  description: string;
  /** NPM package dependencies */
  dependencies?: string[];
  /** Dev dependencies */
  devDependencies?: string[];
  /** Other registry items required */
  registryDependencies?: string[];
  /** Source files */
  files: RegistryFile[];
  /** Classification tags */
  categories?: string[];
  /** Additional metadata */
  meta?: {
    /** Height for iframe preview */
    iframeHeight?: string;
    [key: string]: unknown;
  };
};

/**
 * Central registry index
 */
export type RegistryIndex = {
  /** Registry name */
  name: string;
  /** Registry version */
  version: string;
  /** Available registry items */
  items: Array<{
    name: string;
    type: string;
    description: string;
    url: string;
  }>;
};

// ============================================================================
// Validation Schemas (Zod)
// ============================================================================

/**
 * Zod schema for email validation
 * @example z.string().email({ message: "Invalid email address" })
 */
export const EmailSchema =
  'z.string().email({ message: "Invalid email address" })';

/**
 * Zod schema for username validation
 * @example z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/)
 */
export const UsernameSchema = `z.string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(30, { message: "Username must not exceed 30 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, hyphens, and underscores" })`;

/**
 * Zod schema for phone number validation (E.164 format)
 * @example z.string().regex(/^\+?[1-9]\d{1,14}$/)
 */
export const PhoneSchema = `z.string()
  .regex(/^\\+?[1-9]\\d{1,14}$/, { message: "Invalid phone number format (E.164)" })`;

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

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract the identifier field type based on auth method
 */
export type IdentifierType<T extends AuthMethod> = T extends "email"
  ? string & { __brand: "email" }
  : T extends "username"
    ? string & { __brand: "username" }
    : T extends "phone"
      ? string & { __brand: "phone" }
      : never;

/**
 * Credential input based on auth method
 */
export type AuthenticationCredentials<T extends AuthMethod = AuthMethod> = {
  identifier: IdentifierType<T>;
  password: string;
  rememberMe?: boolean;
};

// ============================================================================
// Exports
// ============================================================================

export type {
  // Utility exports
  AuthenticationCredentials,
  AuthenticationResponse,
  AuthError,
  // Builder exports (internal)
  BuilderConfiguration,
  CredentialLoginClassNames,
  // Main exports
  CredentialLoginFormProps,
  IdentifierType,
  PasswordValidation,
  RegistryFile,
  RegistryIndex,
  // Registry exports
  RegistryItem,
};
