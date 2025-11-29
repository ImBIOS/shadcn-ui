/**
 * Unit tests for CredentialLoginForm email authentication
 * @module tests/unit/credential-login-email
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CredentialLoginForm } from "../../src/components/credential-login-form";

// Import i18n configuration for translations
import "../../src/locales/index";

// Define regex literals at the top level for performance
const EMAIL_REGEX = /email/i;
const PASSWORD_REGEX = /password/i;
const SIGN_IN_REGEX = /sign in/i;
const REMEMBER_ME_REGEX = /remember me/i;
const FORGOT_PASSWORD_REGEX = /forgot password/i;
const SIGNING_IN_REGEX = /signing in/i;

// Mock authClient
const createMockAuthClient = (overrides = {}) => ({
  signIn: {
    email: vi
      .fn()
      .mockResolvedValue({ user: { id: "1", email: "test@example.com" } }),
    username: vi
      .fn()
      .mockResolvedValue({ user: { id: "1", username: "testuser" } }),
    phone: vi
      .fn()
      .mockResolvedValue({ user: { id: "1", phoneNumber: "+1234567890" } }),
    ...overrides,
  },
});

describe("CredentialLoginForm - Email Authentication", () => {
  const mockOnSuccess = vi.fn();
  const _mockOnError = vi.fn();
  let mockAuthClient: ReturnType<typeof createMockAuthClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient = createMockAuthClient();
  });

  describe("Rendering", () => {
    it("renders email input field with correct label", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      expect(screen.getByLabelText(EMAIL_REGEX)).toBeInTheDocument();
    });

    it("renders password input field", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      expect(screen.getByLabelText(PASSWORD_REGEX)).toBeInTheDocument();
    });

    it("renders sign in button", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      expect(
        screen.getByRole("button", { name: SIGN_IN_REGEX })
      ).toBeInTheDocument();
    });

    it("shows email input with type email", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("shows email placeholder", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      expect(emailInput).toHaveAttribute("placeholder", "you@example.com");
    });

    it("has correct autocomplete attributes", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);

      expect(emailInput).toHaveAttribute("autocomplete", "email");
      expect(passwordInput).toHaveAttribute("autocomplete", "current-password");
    });
  });

  describe("Form Submission", () => {
    it("calls authClient.signIn.email with correct credentials on submit", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          rememberMe: false,
        });
      });
    });

    it("calls onSuccess callback after successful authentication", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("includes rememberMe when checkbox is checked", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
          showRememberMe
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: REMEMBER_ME_REGEX,
      });
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(rememberMeCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          rememberMe: true,
        });
      });
    });
  });

  describe("Loading State", () => {
    it("disables form during submission", async () => {
      const user = userEvent.setup();
      // Delay the response to observe loading state
      mockAuthClient.signIn.email = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ user: {} }), 100)
            )
        );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Check loading state
      expect(submitButton).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();

      // Wait for submission to complete
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("shows loading text during submission", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ user: {} }), 100)
            )
        );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(screen.getByText(SIGNING_IN_REGEX)).toBeInTheDocument();
    });
  });

  describe("Two-Factor Authentication", () => {
    it("calls onSuccess when twoFactorRedirect is true", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email = vi
        .fn()
        .mockResolvedValue({ twoFactorRedirect: true });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Optional Features", () => {
    it("shows remember me checkbox when showRememberMe is true", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showRememberMe
        />
      );

      expect(
        screen.getByRole("checkbox", { name: REMEMBER_ME_REGEX })
      ).toBeInTheDocument();
    });

    it("hides remember me checkbox when showRememberMe is false", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showRememberMe={false}
        />
      );

      expect(
        screen.queryByRole("checkbox", { name: REMEMBER_ME_REGEX })
      ).not.toBeInTheDocument();
    });

    it("shows forgot password link when showForgotPassword is true", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showForgotPassword
        />
      );

      expect(screen.getByText(FORGOT_PASSWORD_REGEX)).toBeInTheDocument();
    });

    it("uses custom forgotPasswordUrl", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          forgotPasswordUrl="/custom/forgot"
          showForgotPassword
        />
      );

      const forgotLink = screen.getByText(FORGOT_PASSWORD_REGEX);
      expect(forgotLink).toHaveAttribute("href", "/custom/forgot");
    });
  });

  describe("Disabled State", () => {
    it("disables all inputs when disabled prop is true", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          disabled
          showRememberMe
        />
      );

      expect(screen.getByLabelText(EMAIL_REGEX)).toBeDisabled();
      expect(screen.getByLabelText(PASSWORD_REGEX)).toBeDisabled();
      expect(
        screen.getByRole("button", { name: SIGN_IN_REGEX })
      ).toBeDisabled();
      expect(
        screen.getByRole("checkbox", { name: REMEMBER_ME_REGEX })
      ).toBeDisabled();
    });
  });

  describe("Custom Styling", () => {
    it("applies className to container", () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies classNames to form elements", () => {
      const { container } = render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          classNames={{
            form: "custom-form",
            input: "custom-input",
            button: "custom-button",
          }}
        />
      );

      const form = container.querySelector("form");
      expect(form).toHaveClass("custom-form");

      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });
      expect(submitButton).toHaveClass("custom-button");
    });
  });
});
