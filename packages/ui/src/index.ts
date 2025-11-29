/**
 * @better-auth-ui/components
 *
 * Beautifully designed authentication UI components for better-auth
 *
 * @module @better-auth-ui/components
 * @version 0.1.0
 */

// Export components
export { CredentialLoginForm } from "./components/credential-login-form";
export type { UseFocusTrapOptions } from "./lib/focus-trap";
// Export accessibility utilities
export {
  announceToScreenReader,
  focusFirstInvalidField,
  useFocusTrap,
} from "./lib/focus-trap";
export type {
  PerformanceReportHandler,
  PerformanceTrackingOptions,
} from "./lib/performance";
// Export performance utilities
export {
  initPerformanceTracking,
  isMetricGood,
  PERFORMANCE_THRESHOLDS,
  trackCustomMetric,
} from "./lib/performance";
// Export security utilities
export {
  containsXSSPatterns,
  generateCSRFToken,
  isSafeUrl,
  RECOMMENDED_CSP,
  SECURITY_HEADERS,
  sanitizeInput,
} from "./lib/security";
// Export localization
export { default as i18n } from "./locales/index";
// Export types
export type {
  AuthError,
  AuthErrorCode,
  AuthenticationResponse,
  AuthMethod,
  CredentialLoginClassNames,
  CredentialLoginFormProps,
  PasswordValidation,
} from "./types/index";
export { isAuthError, isAuthenticationResponse } from "./types/index";
