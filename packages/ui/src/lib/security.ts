/**
 * Security utilities for input sanitization and validation
 * @module @imbios/ui/security
 */

/**
 * Sanitize user input to prevent XSS attacks
 *
 * Note: This is a defense-in-depth measure. React already escapes
 * content by default, but this provides additional protection for
 * edge cases and server-side usage.
 *
 * @example
 * ```tsx
 * const safeInput = sanitizeInput(userInput);
 * ```
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Check if a string contains potentially dangerous content
 *
 * @example
 * ```tsx
 * if (containsXSSPatterns(userInput)) {
 *   console.warn('Potentially dangerous input detected');
 * }
 * ```
 */
export function containsXSSPatterns(input: string): boolean {
  if (typeof input !== "string") {
    return false;
  }

  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate that a URL is safe (not javascript: or data: scheme)
 *
 * @example
 * ```tsx
 * if (isSafeUrl(redirectUrl)) {
 *   window.location.href = redirectUrl;
 * }
 * ```
 */
export function isSafeUrl(url: string): boolean {
  if (typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    const dangerousSchemes = ["javascript:", "data:", "vbscript:"];
    return !dangerousSchemes.some((scheme) =>
      parsed.protocol.toLowerCase().startsWith(scheme)
    );
  } catch {
    // Relative URLs are generally safe
    return !url.toLowerCase().startsWith("javascript:");
  }
}

/**
 * Generate a CSRF token for form submissions
 *
 * Note: better-auth handles CSRF protection, but this is useful
 * for custom form implementations.
 *
 * @example
 * ```tsx
 * const csrfToken = generateCSRFToken();
 * // Include in form as hidden field or header
 * ```
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for SSR (not cryptographically secure, use server-side generation)
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Recommended Content Security Policy for authentication pages
 *
 * Use these headers in your deployment configuration.
 */
export const RECOMMENDED_CSP = {
  /**
   * Default CSP for authentication pages (strict)
   */
  strict: [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'", // Tailwind needs unsafe-inline
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join("; "),

  /**
   * Relaxed CSP for documentation/marketing pages
   */
  relaxed: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self' https:",
    "frame-ancestors 'self'",
  ].join("; "),
} as const;

/**
 * Security headers for authentication endpoints
 *
 * Apply these headers to your authentication routes.
 */
export const SECURITY_HEADERS = {
  /**
   * Prevent clickjacking attacks
   */
  "X-Frame-Options": "DENY",

  /**
   * Prevent MIME type sniffing
   */
  "X-Content-Type-Options": "nosniff",

  /**
   * Enable XSS filter in browsers that support it
   */
  "X-XSS-Protection": "1; mode=block",

  /**
   * Control referrer information
   */
  "Referrer-Policy": "strict-origin-when-cross-origin",

  /**
   * Require HTTPS for this domain
   */
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

  /**
   * Disable browser features for security
   */
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
} as const;
