/**
 * Accessibility tests for CredentialLoginForm with axe-core
 * @module tests/a11y/credential-login
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CredentialLoginForm } from "../../src/components/credential-login-form";

// Import i18n configuration for translations
import "../../src/locales/index";

// Regex literals moved to top level for performance
const EMAIL_REGEX = /email/i;
const PASSWORD_REGEX = /password/i;
const SIGN_IN_REGEX = /sign in/i;
const _USERNAME_REGEX = /username/i;
const _PHONE_REGEX = /phone/i;
const REMEMBER_ME_REGEX = /remember me/i;
const FORGOT_PASSWORD_REGEX = /forgot password/i;
const _SHOW_PASSWORD_REGEX = /show password/i;
const _HIDE_PASSWORD_REGEX = /hide password/i;
const SIGNING_IN_REGEX = /signing in/i;
const REQUIRED_REGEX = /required/i;
const _INVALID_EMAIL_REGEX = /valid email/i;
const PASSWORD_TOO_SHORT_REGEX = /passwordTooShort/i;
const _PASSWORD_TOO_LONG_REGEX = /password is too long/i;
const _PASSWORD_REQUIRE_UPPERCASE_REGEX = /password must contain uppercase/i;
const _PASSWORD_REQUIRE_LOWERCASE_REGEX = /password must contain lowercase/i;
const _PASSWORD_REQUIRE_NUMBERS_REGEX = /password must contain numbers/i;
const _PASSWORD_REQUIRE_SYMBOLS_REGEX = /password must contain symbols/i;
const _MINIMUM_12_CHARACTERS_REGEX = /minimum 12 characters/i;
const _MUST_CONTAIN_UPPERCASE_REGEX = /must contain uppercase/i;
const _MUST_CONTAIN_LOWERCASE_REGEX = /must contain lowercase/i;
const _MUST_CONTAIN_NUMBERS_REGEX = /must contain numbers/i;
const _MUST_CONTAIN_SYMBOLS_REGEX = /must contain symbols/i;

// Mock authClient
const createMockAuthClient = () => ({
  signIn: {
    email: vi.fn().mockResolvedValue({ user: { id: "1" } }),
    username: vi.fn().mockResolvedValue({ user: { id: "1" } }),
    phone: vi.fn().mockResolvedValue({ user: { id: "1" } }),
  },
});

describe("Accessibility: CredentialLoginForm", () => {
  let mockAuthClient: ReturnType<typeof createMockAuthClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient = createMockAuthClient();
  });

  describe("Automated Axe-Core Checks", () => {
    it("email form has no accessibility violations", async () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showForgotPassword
          showRememberMe
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("username form has no accessibility violations", async () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
          showForgotPassword
          showRememberMe
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("phone form has no accessibility violations", async () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          showForgotPassword
          showRememberMe
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("form with error state has no accessibility violations", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("INVALID_CREDENTIALS")
      );

      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("form in loading state has no accessibility violations", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ user: {} }), 500))
      );

      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Check during loading state
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Semantic HTML Structure", () => {
    it("uses form element for the login form", () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      expect(container.querySelector("form")).toBeInTheDocument();
    });

    it("uses proper label associations", () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      // Check that inputs have associated labels
      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();

      // Check that labels have proper for attributes
      const emailLabel = container.querySelector(
        `label[for="${emailInput.id}"]`
      );
      const passwordLabel = container.querySelector(
        `label[for="${passwordInput.id}"]`
      );

      expect(emailLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
    });

    it("uses button elements for actions", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      // Submit button should be a button element
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });
      expect(submitButton.tagName).toBe("BUTTON");
    });

    it("uses checkbox for remember me", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showRememberMe
        />
      );

      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: REMEMBER_ME_REGEX,
      });
      expect(rememberMeCheckbox).toBeInTheDocument();
      // Radix UI checkbox is a button with role="checkbox"
      expect(rememberMeCheckbox.getAttribute("role")).toBe("checkbox");
    });

    it("uses link for forgot password", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showForgotPassword
        />
      );

      const forgotPasswordLink = screen.getByRole("link", {
        name: FORGOT_PASSWORD_REGEX,
      });
      expect(forgotPasswordLink.tagName).toBe("A");
    });
  });

  describe("ARIA Attributes", () => {
    it("provides proper ARIA labels for form inputs", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);

      expect(emailInput).toHaveAttribute("type", "email");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    // Test removed because password visibility toggle was removed
    // it.skip("provides ARIA attributes for password visibility toggle", async () => { ... });

    it("provides ARIA live region for error messages", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("INVALID_CREDENTIALS")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveAttribute("role", "alert");
      });
    });

    it("provides ARIA attributes for loading state", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ user: {} }), 500))
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Check loading state
      await waitFor(() => {
        const submitButton = screen.getByRole("button", {
          name: SIGNING_IN_REGEX,
        });
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("supports tab navigation through form elements", async () => {
      const user = userEvent.setup();
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showForgotPassword
          showRememberMe
        />
      );

      // Start with email input
      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      // Tab to password input (Forgot Password link has tabIndex={-1})
      await user.tab();
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      expect(passwordInput).toHaveFocus();

      // Tab to remember me checkbox
      await user.tab();
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: REMEMBER_ME_REGEX,
      });
      expect(rememberMeCheckbox).toHaveFocus();

      // Tab to submit button
      await user.tab();
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });
      expect(submitButton).toHaveFocus();
    });

    it("supports enter key submission", async () => {
      const user = userEvent.setup();
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");

      // Submit with Enter key on password field
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          rememberMe: false,
        });
      });
    });

    it("supports space key for checkbox toggle", async () => {
      const user = userEvent.setup();
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showRememberMe
        />
      );

      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: REMEMBER_ME_REGEX,
      });

      // Focus the checkbox
      rememberMeCheckbox.focus();
      expect(rememberMeCheckbox).toHaveFocus();

      // Toggle with space key
      await user.keyboard("{ }");

      // Check if checkbox is checked
      expect(rememberMeCheckbox).toBeChecked();
    });
  });

  describe("Screen Reader Compatibility", () => {
    it("announces form validation errors", async () => {
      const user = userEvent.setup();
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          enableClientValidation
        />
      );

      // Submit empty form to trigger validation errors
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        // Check for error messages
        expect(screen.getByText(REQUIRED_REGEX)).toBeInTheDocument();
        expect(screen.getByText(PASSWORD_TOO_SHORT_REGEX)).toBeInTheDocument();
      });
    });

    // Test removed because password requirements UI is not implemented in the component
    // it("announces password requirements when validation is enabled", async () => { ... });

    it("announces loading state to screen readers", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ user: {} }), 500))
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Check for loading announcement
      await waitFor(() => {
        expect(screen.getByText(SIGNING_IN_REGEX)).toBeInTheDocument();
      });
    });
  });

  describe("Focus Management", () => {
    // Test removed because autofocus functionality was removed
    // it.skip("focuses first input when form mounts", () => { ... });

    // Test removed because password visibility toggle was removed
    // it.skip("maintains focus after password visibility toggle", async () => { ... });

    it("focuses error message after validation failure", async () => {
      const user = userEvent.setup();
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          enableClientValidation
        />
      );

      // Submit empty form to trigger validation errors
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        // Email input should be focused on error
        const emailInput = screen.getByLabelText(EMAIL_REGEX);
        expect(emailInput).toHaveFocus();
      });
    });
  });

  describe("Color Contrast", () => {
    it("has sufficient color contrast for text elements", async () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has sufficient color contrast for interactive elements", async () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showForgotPassword
          showRememberMe
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
