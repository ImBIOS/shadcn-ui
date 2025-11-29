/**
 * Unit tests for error handling and display
 * @module tests/unit/error-handling
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
const TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

// Mock authClient
const createMockAuthClient = () => ({
  signIn: {
    email: vi.fn(),
    username: vi.fn(),
    phone: vi.fn(),
  },
});

describe("Error Handling and Display", () => {
  const mockOnError = vi.fn();
  let mockAuthClient: ReturnType<typeof createMockAuthClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient = createMockAuthClient();
  });

  describe("Authentication Errors", () => {
    it("displays error message on INVALID_CREDENTIALS error", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("INVALID_CREDENTIALS")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("displays error message on USER_NOT_FOUND error", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("USER_NOT_FOUND")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "notfound@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("displays error message on ACCOUNT_LOCKED error", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("ACCOUNT_LOCKED")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "locked@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("displays error message on RATE_LIMIT_EXCEEDED error", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("RATE_LIMIT_EXCEEDED")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("displays error message on NETWORK error", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(new Error("NETWORK_ERROR"));

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("displays default error message for unknown errors", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(new Error("UNKNOWN_ERROR"));

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });
  });

  describe("Error Callback", () => {
    it("calls onError callback with error details", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("INVALID_CREDENTIALS")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "INVALID_CREDENTIALS",
            message: expect.any(String),
            timestamp: expect.any(String),
          })
        );
      });
    });

    it("includes timestamp in ISO 8601 format", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("INVALID_CREDENTIALS")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        const errorCall = mockOnError.mock.calls[0]?.[0];
        expect(errorCall.timestamp).toMatch(TIMESTAMP_REGEX);
      });
    });
  });

  describe("Password Field Behavior on Error", () => {
    it("clears password field after authentication error", async () => {
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

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(passwordInput).toHaveValue("");
      });
    });

    it("preserves identifier field after authentication error", async () => {
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

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveValue("test@example.com");
      });
    });
  });

  describe("Error Display Accessibility", () => {
    it("displays error with role='alert' for screen readers", async () => {
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

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
      });
    });
  });

  describe("Custom Error Renderer", () => {
    it("uses custom errorRenderer when provided", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("INVALID_CREDENTIALS")
      );

      const customRenderer = vi.fn((error) => (
        <div data-testid="custom-error">Custom: {error.message}</div>
      ));

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          enableClientValidation={false}
          errorRenderer={customRenderer}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(customRenderer).toHaveBeenCalled();
        expect(screen.getByTestId("custom-error")).toBeInTheDocument();
      });
    });
  });

  describe("Form State After Error", () => {
    it("re-enables form after error", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email.mockRejectedValue(
        new Error("INVALID_CREDENTIALS")
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          enableClientValidation={false}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(emailInput).not.toBeDisabled();
        expect(passwordInput).not.toBeDisabled();
      });
    });

    it("allows retry after error", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.email
        .mockRejectedValueOnce(new Error("INVALID_CREDENTIALS"))
        .mockResolvedValueOnce({ user: { id: "1" } });

      const mockOnSuccess = vi.fn();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          enableClientValidation={false}
          onSuccess={mockOnSuccess}
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      // First attempt fails
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // Second attempt succeeds
      await user.type(passwordInput, "correctpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Validation Errors", () => {
    it("displays validation error for invalid email format", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "invalid-email");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Should NOT call API
      expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
    });

    it("displays validation error for empty password", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
        />
      );

      const emailInput = screen.getByLabelText(EMAIL_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Should NOT call API
      expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
    });
  });
});
