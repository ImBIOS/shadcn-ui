/**
 * T079 [US3] Unit test for prop-based component configuration
 *
 * Tests that CredentialLoginForm correctly handles all prop configurations
 * as specified in the component-props.ts contract.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CredentialLoginForm } from "../../src/components/credential-login-form";

// Note: Tests use i18n keys as text since i18n may not be fully initialized in test env
// The component may show "auth.email", "auth.password", "auth.signIn" etc.

// Mock better-auth client
const createMockAuthClient = () => ({
  signIn: {
    email: vi.fn().mockResolvedValue({ user: { id: "1" } }),
    username: vi.fn().mockResolvedValue({ user: { id: "1" } }),
    phone: vi.fn().mockResolvedValue({ user: { id: "1" } }),
  },
});

describe("CredentialLoginForm Props Configuration", () => {
  describe("authMethod prop", () => {
    it("renders email input when authMethod is 'email'", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
        />
      );

      // Look for email input by placeholder
      expect(
        screen.getByPlaceholderText("you@example.com")
      ).toBeInTheDocument();
    });

    it("renders username input when authMethod is 'username'", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="username"
        />
      );

      // Look for username input by placeholder
      expect(screen.getByPlaceholderText("johndoe")).toBeInTheDocument();
    });

    it("renders phone input when authMethod is 'phone'", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="phone"
        />
      );

      // Look for phone input by placeholder
      expect(screen.getByPlaceholderText("+12025551234")).toBeInTheDocument();
    });
  });

  describe("showRememberMe prop", () => {
    it("does not show remember me checkbox by default", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
        />
      );

      // Check by role instead of label text
      const checkboxes = screen.queryAllByRole("checkbox");
      expect(checkboxes.length).toBe(0);
    });

    it("shows remember me checkbox when showRememberMe is true", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          showRememberMe={true}
        />
      );

      // Should have a checkbox
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("hides remember me checkbox when showRememberMe is false", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          showRememberMe={false}
        />
      );

      const checkboxes = screen.queryAllByRole("checkbox");
      expect(checkboxes.length).toBe(0);
    });
  });

  describe("showForgotPassword prop", () => {
    it("does not show forgot password link by default", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
        />
      );

      // No link with forgot password URL
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("shows forgot password link when showForgotPassword is true", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          showForgotPassword={true}
        />
      );

      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    it("uses custom forgotPasswordUrl when provided", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          forgotPasswordUrl="/custom-forgot"
          showForgotPassword={true}
        />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/custom-forgot");
    });

    it("uses default forgotPasswordUrl when not provided", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          showForgotPassword={true}
        />
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/auth/forgot-password");
    });
  });

  describe("className prop", () => {
    it("applies custom className to root container", () => {
      const mockClient = createMockAuthClient();
      const { container } = render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          className="custom-root-class"
        />
      );

      expect(container.querySelector(".custom-root-class")).toBeInTheDocument();
    });
  });

  describe("disabled prop", () => {
    it("disables form when disabled is true", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          disabled={true}
        />
      );

      // Get inputs by placeholder
      expect(screen.getByPlaceholderText("you@example.com")).toBeDisabled();
      expect(screen.getByPlaceholderText("••••••••")).toBeDisabled();
      expect(screen.getByRole("button", { name: /sign/i })).toBeDisabled();
    });

    it("enables form when disabled is false", () => {
      const mockClient = createMockAuthClient();
      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          disabled={false}
        />
      );

      expect(screen.getByPlaceholderText("you@example.com")).not.toBeDisabled();
      expect(screen.getByPlaceholderText("••••••••")).not.toBeDisabled();
      expect(screen.getByRole("button", { name: /sign/i })).not.toBeDisabled();
    });
  });

  describe("onSuccess callback", () => {
    it("calls onSuccess after successful authentication", async () => {
      const user = userEvent.setup();
      const mockClient = createMockAuthClient();
      const onSuccess = vi.fn();

      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          onSuccess={onSuccess}
        />
      );

      await user.type(
        screen.getByPlaceholderText("you@example.com"),
        "test@example.com"
      );
      await user.type(screen.getByPlaceholderText("••••••••"), "password123");
      await user.click(screen.getByRole("button", { name: /sign/i }));

      // Wait for async operations
      await vi.waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("onError callback", () => {
    it("calls onError when authentication fails", async () => {
      const user = userEvent.setup();
      const mockClient = createMockAuthClient();
      mockClient.signIn.email.mockRejectedValue(
        new Error("Invalid credentials")
      );
      const onError = vi.fn();

      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          onError={onError}
        />
      );

      await user.type(
        screen.getByPlaceholderText("you@example.com"),
        "test@example.com"
      );
      await user.type(screen.getByPlaceholderText("••••••••"), "password123");
      await user.click(screen.getByRole("button", { name: /sign/i }));

      // Wait for async operations
      await vi.waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe("passwordValidation prop", () => {
    it("validates minimum length when specified", async () => {
      const user = userEvent.setup();
      const mockClient = createMockAuthClient();

      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          passwordValidation={{ minLength: 12 }}
        />
      );

      await user.type(
        screen.getByPlaceholderText("you@example.com"),
        "test@example.com"
      );
      await user.type(screen.getByPlaceholderText("••••••••"), "short");
      await user.click(screen.getByRole("button", { name: /sign/i }));

      // Should show validation error for short password (i18n key shown since not translated)
      await vi.waitFor(() => {
        expect(
          screen.getByText("auth.errors.passwordTooShort")
        ).toBeInTheDocument();
      });
    });
  });

  describe("enableClientValidation prop", () => {
    it("skips password strength validation when enableClientValidation is false", async () => {
      const user = userEvent.setup();
      const mockClient = createMockAuthClient();

      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          enableClientValidation={false}
          passwordValidation={{ minLength: 20 }} // Would normally require 20 chars
        />
      );

      // Should allow submission with short password (only min(1) is enforced)
      await user.type(
        screen.getByPlaceholderText("you@example.com"),
        "test@example.com"
      );
      await user.type(screen.getByPlaceholderText("••••••••"), "pw"); // Only 2 chars
      await user.click(screen.getByRole("button", { name: /sign/i }));

      // Form should submit (call the API) since password validation is disabled
      await vi.waitFor(() => {
        expect(mockClient.signIn.email).toHaveBeenCalled();
      });
    });
  });

  describe("classNames prop", () => {
    it("applies custom classNames to form elements", () => {
      const mockClient = createMockAuthClient();
      const { container } = render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          classNames={{
            form: "custom-form",
            input: "custom-input",
            button: "custom-button",
          }}
        />
      );

      expect(container.querySelector(".custom-form")).toBeInTheDocument();
    });
  });

  describe("loadingComponent prop", () => {
    it("uses custom loading component during submission", async () => {
      const user = userEvent.setup();
      const mockClient = createMockAuthClient();

      // Make the sign-in take some time
      mockClient.signIn.email.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ user: { id: "1" } }), 100)
          )
      );

      const CustomLoader = () => (
        <span data-testid="custom-loader">Loading...</span>
      );

      render(
        <CredentialLoginForm
          authClient={mockClient as never}
          authMethod="email"
          loadingComponent={CustomLoader}
        />
      );

      await user.type(
        screen.getByPlaceholderText("you@example.com"),
        "test@example.com"
      );
      await user.type(screen.getByPlaceholderText("••••••••"), "password123");
      await user.click(screen.getByRole("button", { name: /sign/i }));

      // Check if custom loader appears
      expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    });
  });
});
