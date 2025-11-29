/**
 * Unit tests for builder option toggles
 *
 * @module tests/unit/builder-options.test.tsx
 * Task: T059 [US2] Unit test for builder option toggles
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BuilderOptions } from "@/components/builder/builder-options";
import type {
  BuilderActions,
  BuilderConfiguration,
} from "@/lib/builder/builder-state";
import { DEFAULT_BUILDER_CONFIG } from "@/lib/builder/builder-state";

// Mock actions
const createMockActions = (): BuilderActions => ({
  setAuthMethod: vi.fn(),
  toggleRememberMe: vi.fn(),
  toggleForgotPassword: vi.fn(),
  setForgotPasswordUrl: vi.fn(),
  toggleValidation: vi.fn(),
  updatePasswordValidation: vi.fn(),
  resetConfig: vi.fn(),
  setConfig: vi.fn(),
});

describe("BuilderOptions Component", () => {
  describe("Rendering", () => {
    it("renders all configuration sections", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      expect(screen.getByText(/authentication method/i)).toBeInTheDocument();
      expect(screen.getByText(/optional features/i)).toBeInTheDocument();
      expect(screen.getByText(/password validation/i)).toBeInTheDocument();
    });

    it("renders auth method radio buttons", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it("renders optional feature checkboxes", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/forgot password/i)).toBeInTheDocument();
    });

    it("renders validation options", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      expect(screen.getByLabelText(/enable validation/i)).toBeInTheDocument();
    });
  });

  describe("Auth Method Selection", () => {
    it("shows email as selected when authMethod is email", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions
          actions={actions}
          config={{ ...DEFAULT_BUILDER_CONFIG, authMethod: "email" }}
        />
      );

      const emailRadio = screen.getByLabelText(/email/i) as HTMLInputElement;
      expect(emailRadio.checked).toBe(true);
    });

    it("shows username as selected when authMethod is username", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions
          actions={actions}
          config={{ ...DEFAULT_BUILDER_CONFIG, authMethod: "username" }}
        />
      );

      const usernameRadio = screen.getByLabelText(
        /username/i
      ) as HTMLInputElement;
      expect(usernameRadio.checked).toBe(true);
    });

    it("shows phone as selected when authMethod is phone", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions
          actions={actions}
          config={{ ...DEFAULT_BUILDER_CONFIG, authMethod: "phone" }}
        />
      );

      const phoneRadio = screen.getByLabelText(/phone/i) as HTMLInputElement;
      expect(phoneRadio.checked).toBe(true);
    });

    it("calls setAuthMethod when selecting email", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions
          actions={actions}
          config={{ ...DEFAULT_BUILDER_CONFIG, authMethod: "username" }}
        />
      );

      const emailRadio = screen.getByLabelText(/email/i);
      fireEvent.click(emailRadio);

      expect(actions.setAuthMethod).toHaveBeenCalledWith("email");
    });

    it("calls setAuthMethod when selecting username", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const usernameRadio = screen.getByLabelText(/username/i);
      fireEvent.click(usernameRadio);

      expect(actions.setAuthMethod).toHaveBeenCalledWith("username");
    });

    it("calls setAuthMethod when selecting phone", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const phoneRadio = screen.getByLabelText(/phone/i);
      fireEvent.click(phoneRadio);

      expect(actions.setAuthMethod).toHaveBeenCalledWith("phone");
    });
  });

  describe("Remember Me Toggle", () => {
    it("shows remember me as unchecked by default", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/remember me/i);
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("shows remember me as checked when enabled", () => {
      const actions = createMockActions();
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        showRememberMe: true,
      };

      render(<BuilderOptions actions={actions} config={config} />);

      const checkbox = screen.getByLabelText(/remember me/i);
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("calls toggleRememberMe when clicked", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/remember me/i);
      fireEvent.click(checkbox);

      expect(actions.toggleRememberMe).toHaveBeenCalled();
    });
  });

  describe("Forgot Password Toggle", () => {
    it("shows forgot password as unchecked by default", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/forgot password/i);
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("shows forgot password as checked when enabled", () => {
      const actions = createMockActions();
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        showForgotPassword: true,
      };

      render(<BuilderOptions actions={actions} config={config} />);

      const checkbox = screen.getByLabelText(/forgot password/i);
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("calls toggleForgotPassword when clicked", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/forgot password/i);
      fireEvent.click(checkbox);

      expect(actions.toggleForgotPassword).toHaveBeenCalled();
    });
  });

  describe("Validation Toggle", () => {
    it("shows validation as checked by default", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/enable validation/i);
      expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("shows validation as unchecked when disabled", () => {
      const actions = createMockActions();
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        enableValidation: false,
      };

      render(<BuilderOptions actions={actions} config={config} />);

      const checkbox = screen.getByLabelText(/enable validation/i);
      expect(checkbox).toHaveAttribute("data-state", "unchecked");
    });

    it("calls toggleValidation when clicked", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/enable validation/i);
      fireEvent.click(checkbox);

      expect(actions.toggleValidation).toHaveBeenCalled();
    });
  });

  describe("Password Validation Options", () => {
    it("shows validation options when validation is enabled", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      expect(screen.getByLabelText(/minimum length/i)).toBeInTheDocument();
    });

    it("hides validation options when validation is disabled", () => {
      const actions = createMockActions();
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        enableValidation: false,
      };

      render(<BuilderOptions actions={actions} config={config} />);

      expect(
        screen.queryByLabelText(/minimum length/i)
      ).not.toBeInTheDocument();
    });

    it("renders password requirement checkboxes", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      expect(screen.getByLabelText(/require uppercase/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/require lowercase/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/require numbers/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/require symbols/i)).toBeInTheDocument();
    });

    it("calls updatePasswordValidation when minLength changes", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const minLengthInput = screen.getByLabelText(/minimum length/i);
      fireEvent.change(minLengthInput, { target: { value: "12" } });

      expect(actions.updatePasswordValidation).toHaveBeenCalledWith({
        minLength: 12,
      });
    });

    it("calls updatePasswordValidation when requireUppercase is toggled", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/require uppercase/i);
      fireEvent.click(checkbox);

      expect(actions.updatePasswordValidation).toHaveBeenCalledWith({
        requireUppercase: true,
      });
    });

    it("calls updatePasswordValidation when requireLowercase is toggled", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/require lowercase/i);
      fireEvent.click(checkbox);

      expect(actions.updatePasswordValidation).toHaveBeenCalledWith({
        requireLowercase: true,
      });
    });

    it("calls updatePasswordValidation when requireNumbers is toggled", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/require numbers/i);
      fireEvent.click(checkbox);

      expect(actions.updatePasswordValidation).toHaveBeenCalledWith({
        requireNumbers: true,
      });
    });

    it("calls updatePasswordValidation when requireSymbols is toggled", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const checkbox = screen.getByLabelText(/require symbols/i);
      fireEvent.click(checkbox);

      expect(actions.updatePasswordValidation).toHaveBeenCalledWith({
        requireSymbols: true,
      });
    });
  });

  describe("Reset Configuration", () => {
    it("renders reset button", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      expect(
        screen.getByRole("button", { name: /reset/i })
      ).toBeInTheDocument();
    });

    it("calls resetConfig when reset button is clicked", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const resetButton = screen.getByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);

      expect(actions.resetConfig).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has accessible labels for all form controls", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      // All controls should be accessible via getByLabelText
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/forgot password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/enable validation/i)).toBeInTheDocument();
    });

    it("uses fieldset and legend for auth method group", () => {
      const actions = createMockActions();

      render(
        <BuilderOptions actions={actions} config={DEFAULT_BUILDER_CONFIG} />
      );

      const fieldset = screen.getByRole("group", {
        name: /authentication method/i,
      });
      expect(fieldset).toBeInTheDocument();
    });
  });
});
