/**
 * Integration test for builder UI option toggling and preview updates
 *
 * @module tests/integration/builder-ui.test.tsx
 * Task: T076 [US2] Integration test for builder UI option toggling
 */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthBuilder } from "@/components/builder/auth-builder";

describe("Integration: Builder UI Option Toggling", () => {
  describe("Full Builder Flow", () => {
    it("renders complete builder UI with all sections", () => {
      const { container } = render(<AuthBuilder />);

      // Check header (h1)
      expect(
        screen.getByRole("heading", { name: /credential login builder/i })
      ).toBeInTheDocument();

      // Check configuration section (card title - CardTitle is a div, not a heading)
      const cardTitles = container.querySelectorAll('[data-slot="card-title"]');
      const titleTexts = Array.from(cardTitles).map((el) => el.textContent);
      expect(titleTexts).toContain("Configuration");
      expect(titleTexts).toContain("Live Preview");
      expect(titleTexts).toContain("Installation");
    });

    it("updates preview when authMethod changes", () => {
      render(<AuthBuilder />);

      // Initial state should show email
      const preview = screen.getByTestId("builder-preview");
      expect(within(preview).getByLabelText(/email/i)).toBeInTheDocument();

      // Click username radio
      const usernameRadio = screen.getByLabelText(/^username$/i);
      fireEvent.click(usernameRadio);

      // Preview should now show username
      expect(within(preview).getByLabelText(/username/i)).toBeInTheDocument();
      expect(
        within(preview).queryByLabelText(/email/i)
      ).not.toBeInTheDocument();
    });

    it("updates preview when showRememberMe is toggled", () => {
      render(<AuthBuilder />);

      const preview = screen.getByTestId("builder-preview");

      // Initially, remember me should not be visible
      expect(
        within(preview).queryByLabelText(/remember me/i)
      ).not.toBeInTheDocument();

      // Toggle remember me
      const rememberMeCheckbox = screen.getByLabelText(/^remember me$/i);
      fireEvent.click(rememberMeCheckbox);

      // Remember me should now be visible in preview
      expect(
        within(preview).getByLabelText(/remember me/i)
      ).toBeInTheDocument();
    });

    it("updates preview when showForgotPassword is toggled", () => {
      render(<AuthBuilder />);

      const preview = screen.getByTestId("builder-preview");

      // Initially, forgot password link should not be visible
      expect(
        within(preview).queryByRole("link", { name: /forgot password/i })
      ).not.toBeInTheDocument();

      // Toggle forgot password
      const forgotPasswordCheckbox =
        screen.getByLabelText(/^forgot password$/i);
      fireEvent.click(forgotPasswordCheckbox);

      // Forgot password link should now be visible in preview
      expect(
        within(preview).getByRole("link", { name: /forgot password/i })
      ).toBeInTheDocument();
    });

    it("enables/disables validation options when toggle changes", () => {
      render(<AuthBuilder />);

      // Validation options should be visible by default
      expect(screen.getByLabelText(/minimum length/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/require uppercase/i)).toBeInTheDocument();

      // Toggle validation off
      const validationCheckbox = screen.getByLabelText(/enable validation/i);
      fireEvent.click(validationCheckbox);

      // Validation options should be hidden
      expect(
        screen.queryByLabelText(/minimum length/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/require uppercase/i)
      ).not.toBeInTheDocument();

      // Toggle validation back on
      fireEvent.click(validationCheckbox);

      // Validation options should be visible again
      expect(screen.getByLabelText(/minimum length/i)).toBeInTheDocument();
    });
  });

  describe("Auth Method Switching", () => {
    it("updates preview placeholder based on auth method", () => {
      render(<AuthBuilder />);

      const preview = screen.getByTestId("builder-preview");

      // Email placeholder
      expect(
        within(preview).getByPlaceholderText(/name@example.com/i)
      ).toBeInTheDocument();

      // Switch to username
      fireEvent.click(screen.getByLabelText(/^username$/i));
      expect(
        within(preview).getByPlaceholderText(/johndoe/i)
      ).toBeInTheDocument();

      // Switch to phone
      fireEvent.click(screen.getByLabelText(/phone/i));
      expect(
        within(preview).getByPlaceholderText(/\+1234567890/i)
      ).toBeInTheDocument();
    });

    it("maintains other settings when switching auth methods", () => {
      render(<AuthBuilder />);

      // Enable remember me
      const rememberMeCheckbox = screen.getByLabelText(/^remember me$/i);
      fireEvent.click(rememberMeCheckbox);

      // Switch auth method
      fireEvent.click(screen.getByLabelText(/^username$/i));

      // Remember me should still be enabled
      expect(rememberMeCheckbox).toHaveAttribute("data-state", "checked");

      // Preview should still show remember me
      const preview = screen.getByTestId("builder-preview");
      expect(
        within(preview).getByLabelText(/remember me/i)
      ).toBeInTheDocument();
    });
  });

  describe("Validation Options", () => {
    it("allows changing minimum password length", () => {
      render(<AuthBuilder />);

      const minLengthInput = screen.getByLabelText(/minimum length/i);

      // Change to 12
      fireEvent.change(minLengthInput, { target: { value: "12" } });

      // Value should update
      expect(minLengthInput).toHaveValue(12);
    });

    it("allows toggling password requirements", () => {
      render(<AuthBuilder />);

      // Toggle uppercase requirement
      const uppercaseCheckbox = screen.getByLabelText(/require uppercase/i);
      fireEvent.click(uppercaseCheckbox);
      expect(uppercaseCheckbox).toHaveAttribute("data-state", "checked");

      // Toggle numbers requirement
      const numbersCheckbox = screen.getByLabelText(/require numbers/i);
      fireEvent.click(numbersCheckbox);
      expect(numbersCheckbox).toHaveAttribute("data-state", "checked");

      // Toggle symbols requirement
      const symbolsCheckbox = screen.getByLabelText(/require symbols/i);
      fireEvent.click(symbolsCheckbox);
      expect(symbolsCheckbox).toHaveAttribute("data-state", "checked");
    });
  });

  describe("Reset Functionality", () => {
    it("resets all configuration to defaults", () => {
      const { container } = render(<AuthBuilder />);

      // Get specific config elements (using radio button IDs to avoid duplicate matches)
      const usernameRadio = container.querySelector(
        "#auth-username"
      ) as HTMLInputElement;
      const emailRadio = container.querySelector(
        "#auth-email"
      ) as HTMLInputElement;
      const rememberMeCheckbox = screen.getByLabelText(/^remember me$/i);
      const forgotPasswordCheckbox =
        screen.getByLabelText(/^forgot password$/i);
      const minLengthInput = screen.getByLabelText(/minimum length/i);

      // Make some changes
      fireEvent.click(usernameRadio);
      fireEvent.click(rememberMeCheckbox);
      fireEvent.click(forgotPasswordCheckbox);
      fireEvent.change(minLengthInput, {
        target: { value: "20" },
      });

      // Verify changes
      expect(usernameRadio.checked).toBe(true);
      expect(rememberMeCheckbox).toHaveAttribute("data-state", "checked");

      // Reset
      const resetButton = screen.getByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);

      // Verify reset to defaults
      expect(emailRadio.checked).toBe(true);
      expect(screen.getByLabelText(/^remember me$/i)).toHaveAttribute(
        "data-state",
        "unchecked"
      );
      expect(screen.getByLabelText(/^forgot password$/i)).toHaveAttribute(
        "data-state",
        "unchecked"
      );
      expect(screen.getByLabelText(/minimum length/i)).toHaveValue(8);
    });
  });
});
