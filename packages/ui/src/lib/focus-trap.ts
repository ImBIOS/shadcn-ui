/**
 * Focus trap utility for modal/dialog accessibility
 * @module @better-auth-ui/components/focus-trap
 */

import { type RefObject, useEffect, useRef } from "react";

/**
 * Focusable element selectors
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
}

/**
 * Options for the useFocusTrap hook
 */
export type UseFocusTrapOptions = {
  /** Whether the focus trap is active */
  enabled?: boolean;
  /** Callback when escape key is pressed */
  onEscape?: () => void;
  /** Return focus to this element when trap is deactivated */
  returnFocusRef?: RefObject<HTMLElement>;
  /** Auto-focus the first focusable element on mount */
  autoFocus?: boolean;
};

/**
 * Hook to trap focus within a container element
 *
 * Useful for modals, dialogs, and other overlay components
 * where focus should be contained within the component.
 *
 * @example
 * ```tsx
 * function LoginModal({ isOpen, onClose }) {
 *   const containerRef = useFocusTrap<HTMLDivElement>({
 *     enabled: isOpen,
 *     onEscape: onClose,
 *   });
 *
 *   return (
 *     <div ref={containerRef}>
 *       <CredentialLoginForm {...props} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: UseFocusTrapOptions = {}
): RefObject<T | null> {
  const {
    enabled = true,
    onEscape,
    returnFocusRef,
    autoFocus = true,
  } = options;

  const containerRef = useRef<T>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Store currently focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Auto-focus first focusable element
    if (autoFocus) {
      const focusableElements = getFocusableElements(container);
      const firstFocusable = focusableElements[0];
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    // Handle tab key navigation
    const handleTabKey = (event: KeyboardEvent) => {
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!(firstElement && lastElement)) {
        return;
      }

      // Shift + Tab at first element -> go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      // Tab at last element -> go to first
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        return;
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key === "Tab") {
        handleTabKey(event);
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);

      // Return focus to previous element
      const returnElement =
        returnFocusRef?.current ?? previouslyFocusedRef.current;
      if (returnElement && typeof returnElement.focus === "function") {
        returnElement.focus();
      }
    };
  }, [enabled, onEscape, returnFocusRef, autoFocus]);

  return containerRef;
}

/**
 * Focus the first invalid form field
 *
 * Useful for accessibility when form validation fails
 *
 * @example
 * ```tsx
 * const handleSubmit = async (data) => {
 *   try {
 *     await authClient.signIn.email(data);
 *   } catch (error) {
 *     focusFirstInvalidField(formRef.current);
 *   }
 * };
 * ```
 */
export function focusFirstInvalidField(container: HTMLElement | null): void {
  if (!container) {
    return;
  }

  const invalidField = container.querySelector<HTMLElement>(
    '[aria-invalid="true"], .error, :invalid'
  );

  if (invalidField && typeof invalidField.focus === "function") {
    invalidField.focus();
  }
}

/**
 * Announce a message to screen readers
 *
 * @example
 * ```tsx
 * // Announce error message
 * announceToScreenReader('Login failed. Please check your credentials.');
 * ```
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
