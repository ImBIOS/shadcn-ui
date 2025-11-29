/**
 * Unit tests for CredentialLoginForm username authentication
 * @module tests/unit/credential-login-username
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CredentialLoginForm } from "../../src/components/credential-login-form";

// Import i18n configuration for translations
import "../../src/locales/index";

// Define regex literals at the top level for performance
const USERNAME_REGEX = /username/i;
const PASSWORD_REGEX = /password/i;
const SIGN_IN_REGEX = /sign in/i;
const REMEMBER_ME_REGEX = /remember me/i;

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

describe("CredentialLoginForm - Username Authentication", () => {
  const mockOnSuccess = vi.fn();
  let mockAuthClient: ReturnType<typeof createMockAuthClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient = createMockAuthClient();
  });

  describe("Rendering", () => {
    it("renders username input field with correct label", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
        />
      );

      expect(screen.getByLabelText(USERNAME_REGEX)).toBeInTheDocument();
    });

    it("shows username input with type text", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      expect(usernameInput).toHaveAttribute("type", "text");
    });

    it("shows username placeholder", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      expect(usernameInput).toHaveAttribute("placeholder", "johndoe");
    });

    it("has correct autocomplete attribute for username", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      expect(usernameInput).toHaveAttribute("autocomplete", "username");
    });
  });

  describe("Form Submission", () => {
    it("calls authClient.signIn.username with correct credentials on submit", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
          onSuccess={mockOnSuccess}
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.username).toHaveBeenCalledWith({
          username: "testuser",
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
          authMethod="username"
          onSuccess={mockOnSuccess}
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("does not call signIn.email when authMethod is username", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
          onSuccess={mockOnSuccess}
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.username).toHaveBeenCalled();
        expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
        expect(mockAuthClient.signIn.phone).not.toHaveBeenCalled();
      });
    });

    it("includes rememberMe when checkbox is checked", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
          onSuccess={mockOnSuccess}
          showRememberMe
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: REMEMBER_ME_REGEX,
      });
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(rememberMeCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.username).toHaveBeenCalledWith({
          username: "testuser",
          password: "password123",
          rememberMe: true,
        });
      });
    });
  });

  describe("Username Validation", () => {
    it("validates minimum username length", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "ab"); // Too short (less than 3 chars)
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // The form should show validation error and NOT call API
      await waitFor(() => {
        expect(mockAuthClient.signIn.username).not.toHaveBeenCalled();
      });
    });

    it("validates username character restrictions", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "user@name!"); // Invalid characters
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // The form should show validation error and NOT call API
      await waitFor(() => {
        expect(mockAuthClient.signIn.username).not.toHaveBeenCalled();
      });
    });

    it("allows valid username with hyphens and underscores", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
          onSuccess={mockOnSuccess}
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "test-user_123");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.username).toHaveBeenCalledWith({
          username: "test-user_123",
          password: "password123",
          rememberMe: false,
        });
      });
    });
  });

  describe("Loading State", () => {
    it("disables form during submission", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.username = vi
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
          authMethod="username"
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Two-Factor Authentication", () => {
    it("calls onSuccess when twoFactorRedirect is true", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.username = vi
        .fn()
        .mockResolvedValue({ twoFactorRedirect: true });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="username"
          onSuccess={mockOnSuccess}
        />
      );

      const usernameInput = screen.getByLabelText(USERNAME_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });
});
