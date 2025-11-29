/**
 * Integration test for full authentication flow with mocked better-auth SDK
 * @module tests/integration/auth-flow
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CredentialLoginForm } from "../../src/components/credential-login-form";

// Import i18n configuration for translations
import "../../src/locales/index";

// Regex literals moved to top level for performance
const EMAIL_REGEX = /email/i;
const PASSWORD_REGEX = /password/i;
const REMEMBER_ME_REGEX = /remember me/i;
const SIGN_IN_REGEX = /sign in/i;
const FORGOT_PASSWORD_REGEX = /forgot password/i;
const USERNAME_REGEX = /username/i;
const PHONE_NUMBER_REGEX = /phone number/i;
const SIGNING_IN_REGEX = /signing in/i;

// Comprehensive mock of better-auth SDK
const createMockAuthClient = () => ({
  signIn: {
    email: vi.fn(),
    username: vi.fn(),
    phone: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
  session: {
    get: vi.fn(),
  },
});

describe("Integration: Full Authentication Flow", () => {
  let mockAuthClient: ReturnType<typeof createMockAuthClient>;
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient = createMockAuthClient();
  });

  describe("Email Authentication Flow", () => {
    it("completes full email login flow successfully", async () => {
      const user = userEvent.setup();

      // Mock successful authentication response
      mockAuthClient.signIn.email.mockResolvedValue({
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
        },
        session: {
          token: "session-token-abc",
          expiresAt: "2025-12-26T10:00:00Z",
        },
      });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
          showForgotPassword
          showRememberMe
        />
      );

      // Step 1: User sees the form
      expect(screen.getByLabelText(EMAIL_REGEX)).toBeInTheDocument();
      expect(screen.getByLabelText(PASSWORD_REGEX)).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: REMEMBER_ME_REGEX })
      ).toBeInTheDocument();
      expect(screen.getByText(FORGOT_PASSWORD_REGEX)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: SIGN_IN_REGEX })
      ).toBeInTheDocument();

      // Step 2: User enters credentials
      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "SecureP@ss123");
      await user.click(
        screen.getByRole("checkbox", { name: REMEMBER_ME_REGEX })
      );

      // Step 3: User submits
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Step 4: Verify SDK was called with correct parameters
      await waitFor(() => {
        expect(mockAuthClient.signIn.email).toHaveBeenCalledTimes(1);
        expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "SecureP@ss123",
          rememberMe: true,
        });
      });

      // Step 5: Verify success callback was called
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });

      // Step 6: Verify form is no longer in loading state
      expect(
        screen.getByRole("button", { name: SIGN_IN_REGEX })
      ).not.toBeDisabled();
    });

    it("handles authentication failure gracefully", async () => {
      const user = userEvent.setup();

      // Mock authentication failure
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

      // Enter credentials and submit
      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "wrongpassword");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // Verify password was cleared
      expect(screen.getByLabelText(PASSWORD_REGEX)).toHaveValue("");

      // Verify email was preserved
      expect(screen.getByLabelText(EMAIL_REGEX)).toHaveValue(
        "test@example.com"
      );

      // Verify error callback was called
      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "INVALID_CREDENTIALS",
        })
      );
    });

    it("handles two-factor authentication redirect", async () => {
      const user = userEvent.setup();

      // Mock 2FA required response
      mockAuthClient.signIn.email.mockResolvedValue({
        twoFactorRedirect: true,
      });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Verify onSuccess is called for 2FA flow handling
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Username Authentication Flow", () => {
    it("completes full username login flow successfully", async () => {
      const user = userEvent.setup();

      mockAuthClient.signIn.username.mockResolvedValue({
        user: {
          id: "user-456",
          username: "testuser",
          name: "Test User",
        },
        session: {
          token: "session-token-def",
          expiresAt: "2025-12-26T10:00:00Z",
        },
      });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
          onSuccess={mockOnSuccess}
        />
      );

      // Verify correct label
      expect(screen.getByLabelText(USERNAME_REGEX)).toBeInTheDocument();

      await user.type(screen.getByLabelText(USERNAME_REGEX), "testuser");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        expect(mockAuthClient.signIn.username).toHaveBeenCalledWith({
          username: "testuser",
          password: "password123",
          rememberMe: false,
        });
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Phone Authentication Flow", () => {
    it("completes full phone login flow successfully", async () => {
      const user = userEvent.setup();

      mockAuthClient.signIn.phone.mockResolvedValue({
        user: {
          id: "user-789",
          phoneNumber: "+12025551234",
          name: "Test User",
        },
        session: {
          token: "session-token-ghi",
          expiresAt: "2025-12-26T10:00:00Z",
        },
      });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      // Verify correct label
      expect(screen.getByLabelText(PHONE_NUMBER_REGEX)).toBeInTheDocument();

      await user.type(
        screen.getByLabelText(PHONE_NUMBER_REGEX),
        "+12025551234"
      );
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalledWith({
          phoneNumber: "+12025551234",
          password: "password123",
          rememberMe: false,
        });
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Form Validation Integration", () => {
    it("prevents submission with invalid email", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "invalid-email");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Should NOT call the SDK
      expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it("prevents submission with empty password", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onSuccess={mockOnSuccess}
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Should NOT call the SDK
      expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
    });

    it("enforces password validation rules", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          enableClientValidation
          passwordValidation={{
            minLength: 12,
            requireUppercase: true,
            requireNumbers: true,
            requireSymbols: true,
          }}
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "weak");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // Should NOT call the SDK due to password validation failure
      expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
    });
  });

  describe("Loading State Integration", () => {
    it("shows loading state and disables inputs during API call", async () => {
      const user = userEvent.setup();

      // Delay the response
      mockAuthClient.signIn.email.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ user: {} }), 200))
      );

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          showRememberMe
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      // During loading
      expect(screen.getByLabelText(EMAIL_REGEX)).toBeDisabled();
      expect(screen.getByLabelText(PASSWORD_REGEX)).toBeDisabled();
      expect(
        screen.getByRole("checkbox", { name: REMEMBER_ME_REGEX })
      ).toBeDisabled();
      expect(screen.getByText(SIGNING_IN_REGEX)).toBeInTheDocument();

      // Wait for completion
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: SIGN_IN_REGEX })
        ).not.toBeDisabled();
      });
    });
  });

  describe("Network Error Handling", () => {
    it("handles network errors gracefully", async () => {
      const user = userEvent.setup();

      mockAuthClient.signIn.email.mockRejectedValue(new Error("NETWORK_ERROR"));

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
        />
      );

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalled();
      });

      // Form should be re-enabled for retry
      expect(
        screen.getByRole("button", { name: SIGN_IN_REGEX })
      ).not.toBeDisabled();
    });

    it("handles rate limit errors", async () => {
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

      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "password123");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });
  });

  describe("Retry Flow", () => {
    it("allows successful retry after failed attempt", async () => {
      const user = userEvent.setup();

      // First call fails, second succeeds
      mockAuthClient.signIn.email
        .mockRejectedValueOnce(new Error("INVALID_CREDENTIALS"))
        .mockResolvedValueOnce({ user: { id: "1" } });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="email"
          onError={mockOnError}
          onSuccess={mockOnSuccess}
        />
      );

      // First attempt
      await user.type(screen.getByLabelText(EMAIL_REGEX), "test@example.com");
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "wrongpassword");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // Retry with correct password
      await user.type(screen.getByLabelText(PASSWORD_REGEX), "correctpassword");
      await user.click(screen.getByRole("button", { name: SIGN_IN_REGEX }));

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });

      expect(mockAuthClient.signIn.email).toHaveBeenCalledTimes(2);
    });
  });
});
