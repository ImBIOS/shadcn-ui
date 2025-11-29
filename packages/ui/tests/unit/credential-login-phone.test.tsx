/**
 * Unit tests for CredentialLoginForm phone authentication
 * @module tests/unit/credential-login-phone
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CredentialLoginForm } from "../../src/components/credential-login-form";

// Import i18n configuration for translations
import "../../src/locales/index";

// Define regex literals at the top level for performance
const PHONE_NUMBER_REGEX = /phone number/i;
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

describe("CredentialLoginForm - Phone Authentication", () => {
  const mockOnSuccess = vi.fn();
  const _mockOnError = vi.fn();
  let mockAuthClient: ReturnType<typeof createMockAuthClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient = createMockAuthClient();
  });

  describe("Rendering", () => {
    it("renders phone number input field with correct label", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
        />
      );

      expect(screen.getByLabelText(PHONE_NUMBER_REGEX)).toBeInTheDocument();
    });

    it("shows phone input with type text", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      expect(phoneInput).toHaveAttribute("type", "text");
    });

    it("shows phone placeholder in E.164 format", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      expect(phoneInput).toHaveAttribute("placeholder", "+12025551234");
    });

    it("has correct autocomplete attribute for phone", () => {
      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      expect(phoneInput).toHaveAttribute("autocomplete", "tel");
    });
  });

  describe("Form Submission", () => {
    it("calls authClient.signIn.phone with correct credentials on submit", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+12025551234");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalledWith({
          phoneNumber: "+12025551234",
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
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+12025551234");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("does not call signIn.email or signIn.username when authMethod is phone", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+12025551234");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalled();
        expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
        expect(mockAuthClient.signIn.username).not.toHaveBeenCalled();
      });
    });

    it("includes rememberMe when checkbox is checked", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
          showRememberMe
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: REMEMBER_ME_REGEX,
      });
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+12025551234");
      await user.type(passwordInput, "password123");
      await user.click(rememberMeCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalledWith({
          phoneNumber: "+12025551234",
          password: "password123",
          rememberMe: true,
        });
      });
    });
  });

  describe("Phone Number Validation (E.164 Format)", () => {
    it("validates E.164 format with country code", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+442071234567"); // UK number
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalledWith({
          phoneNumber: "+442071234567",
          password: "password123",
          rememberMe: false,
        });
      });
    });

    it("rejects invalid phone number format", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "invalid-phone"); // Invalid format
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // The form should show validation error and NOT call the API
      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).not.toHaveBeenCalled();
      });
    });

    it("rejects phone numbers starting with 0", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "01onal234567890"); // Starts with 0
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).not.toHaveBeenCalled();
      });
    });

    it("accepts phone numbers with or without + prefix", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "12025551234"); // Without + prefix
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalledWith({
          phoneNumber: "12025551234",
          password: "password123",
          rememberMe: false,
        });
      });
    });
  });

  describe("Loading State", () => {
    it("disables form during submission", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.phone = vi
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
          authMethod="phone"
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+12025551234");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(phoneInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Two-Factor Authentication", () => {
    it("calls onSuccess when twoFactorRedirect is true", async () => {
      const user = userEvent.setup();
      mockAuthClient.signIn.phone = vi
        .fn()
        .mockResolvedValue({ twoFactorRedirect: true });

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+12025551234");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("International Phone Numbers", () => {
    it("accepts US phone number", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+14155551234");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalled();
      });
    });

    it("accepts UK phone number", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+447911123456");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalled();
      });
    });

    it("accepts German phone number", async () => {
      const user = userEvent.setup();

      render(
        <CredentialLoginForm
          authClient={mockAuthClient as never}
          authMethod="phone"
          onSuccess={mockOnSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(PHONE_NUMBER_REGEX);
      const passwordInput = screen.getByLabelText(PASSWORD_REGEX);
      const submitButton = screen.getByRole("button", { name: SIGN_IN_REGEX });

      await user.type(phoneInput, "+491511234567");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthClient.signIn.phone).toHaveBeenCalled();
      });
    });
  });
});
