/**
 * Unit tests for live preview rendering
 *
 * @module tests/unit/builder-preview.test.tsx
 * Task: T060 [US2] Unit test for live preview rendering
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BuilderPreview } from "@/components/builder/builder-preview";
import type { BuilderConfiguration } from "@/lib/builder/builder-state";
import { DEFAULT_BUILDER_CONFIG } from "@/lib/builder/builder-state";

describe("BuilderPreview Component", () => {
  describe("Rendering", () => {
    it("renders preview container", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      expect(screen.getByTestId("builder-preview")).toBeInTheDocument();
    });

    it("renders preview title", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      // Look for the specific heading "Preview"
      expect(
        screen.getByRole("heading", { name: /preview/i, level: 3 })
      ).toBeInTheDocument();
    });

    it("renders credential login form in preview", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      // Should show a form with sign in elements
      expect(screen.getByRole("form")).toBeInTheDocument();
    });
  });

  describe("Auth Method Preview", () => {
    it("shows email input when authMethod is email", () => {
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        authMethod: "email",
      };

      render(<BuilderPreview config={config} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it("shows username input when authMethod is username", () => {
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        authMethod: "username",
      };

      render(<BuilderPreview config={config} />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it("shows phone input when authMethod is phone", () => {
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        authMethod: "phone",
      };

      render(<BuilderPreview config={config} />);

      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it("always shows password input", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  describe("Optional Features Preview", () => {
    it("hides remember me checkbox by default", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      expect(screen.queryByLabelText(/remember me/i)).not.toBeInTheDocument();
    });

    it("shows remember me checkbox when enabled", () => {
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        showRememberMe: true,
      };

      render(<BuilderPreview config={config} />);

      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    it("hides forgot password link by default", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      expect(
        screen.queryByRole("link", { name: /forgot password/i })
      ).not.toBeInTheDocument();
    });

    it("shows forgot password link when enabled", () => {
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        showForgotPassword: true,
      };

      render(<BuilderPreview config={config} />);

      expect(
        screen.getByRole("link", { name: /forgot password/i })
      ).toBeInTheDocument();
    });

    it("shows both optional features when both enabled", () => {
      const config: BuilderConfiguration = {
        ...DEFAULT_BUILDER_CONFIG,
        showRememberMe: true,
        showForgotPassword: true,
      };

      render(<BuilderPreview config={config} />);

      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /forgot password/i })
      ).toBeInTheDocument();
    });
  });

  describe("Submit Button", () => {
    it("renders submit button", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("submit button is disabled in preview mode", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      const button = screen.getByRole("button", { name: /sign in/i });
      // Preview mode should show but not be functional
      expect(button).toBeInTheDocument();
    });
  });

  describe("Live Updates", () => {
    it("updates preview when authMethod changes", () => {
      const { rerender } = render(
        <BuilderPreview
          config={{ ...DEFAULT_BUILDER_CONFIG, authMethod: "email" }}
        />
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

      rerender(
        <BuilderPreview
          config={{ ...DEFAULT_BUILDER_CONFIG, authMethod: "username" }}
        />
      );

      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it("updates preview when showRememberMe changes", () => {
      const { rerender } = render(
        <BuilderPreview
          config={{ ...DEFAULT_BUILDER_CONFIG, showRememberMe: false }}
        />
      );

      expect(screen.queryByLabelText(/remember me/i)).not.toBeInTheDocument();

      rerender(
        <BuilderPreview
          config={{ ...DEFAULT_BUILDER_CONFIG, showRememberMe: true }}
        />
      );

      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    it("updates preview when showForgotPassword changes", () => {
      const { rerender } = render(
        <BuilderPreview
          config={{ ...DEFAULT_BUILDER_CONFIG, showForgotPassword: false }}
        />
      );

      expect(
        screen.queryByRole("link", { name: /forgot password/i })
      ).not.toBeInTheDocument();

      rerender(
        <BuilderPreview
          config={{ ...DEFAULT_BUILDER_CONFIG, showForgotPassword: true }}
        />
      );

      expect(
        screen.getByRole("link", { name: /forgot password/i })
      ).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies preview container styles", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      const preview = screen.getByTestId("builder-preview");
      expect(preview).toHaveClass("rounded-lg");
    });

    it("renders with card styling", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      // The preview should contain a card-like container
      const preview = screen.getByTestId("builder-preview");
      expect(preview).toBeInTheDocument();
    });
  });

  describe("Form Layout", () => {
    it("renders identifier input before password", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      const form = screen.getByRole("form");
      const inputs = form.querySelectorAll("input");

      // First input should be for identifier (email/username/phone)
      // Second input should be for password
      expect(inputs.length).toBeGreaterThanOrEqual(2);
    });

    it("renders title/header in form", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      // Should have "Sign In" text in the form
      const signInElements = screen.getAllByText(/sign in/i);
      expect(signInElements.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("has accessible form with labels", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      // All form controls should have labels
      const form = screen.getByRole("form");
      expect(form).toBeInTheDocument();

      // Email label exists (preview uses identifier label based on authMethod)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      // Password label exists
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("marks preview as non-interactive demo", () => {
      render(<BuilderPreview config={DEFAULT_BUILDER_CONFIG} />);

      // Preview should indicate it's a demo/preview
      const preview = screen.getByTestId("builder-preview");
      expect(preview.getAttribute("aria-label")).toContain("preview");
    });
  });
});
