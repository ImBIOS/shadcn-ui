/**
 * Builder Preview Component
 *
 * Live preview panel for the credential login builder UI.
 * Shows a real-time preview of the form based on configuration.
 *
 * @module @imbios/ui-web/builder
 * Task: T064 [US2] Create builder-preview.tsx live preview panel
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BuilderConfiguration } from "@/lib/builder/builder-state";
import { getAuthMethodLabel } from "@/lib/builder/builder-state";

// ============================================================================
// Types
// ============================================================================

type BuilderPreviewProps = {
  config: BuilderConfiguration;
};

// ============================================================================
// Component
// ============================================================================

/**
 * BuilderPreview Component
 *
 * Renders a live preview of the credential login form
 * based on the current builder configuration.
 */
export function BuilderPreview({ config }: BuilderPreviewProps) {
  const identifierLabel = getAuthMethodLabel(config.authMethod);
  const identifierPlaceholder = getPlaceholder(config.authMethod);
  const identifierType = getInputType(config.authMethod);

  return (
    <section
      aria-label="Form preview"
      className="rounded-lg border border-border bg-card/50 p-6"
      data-testid="builder-preview"
      title="Form preview"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-foreground text-lg">Preview</h3>
        <p className="text-muted-foreground text-sm">
          Live preview of your credential login form
        </p>
      </div>

      <div className="flex items-center justify-center py-8">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="font-bold text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your {identifierLabel.toLowerCase()} to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              aria-label="Sign in form"
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Identifier Field */}
              <div className="space-y-2">
                <Label htmlFor="preview-identifier">{identifierLabel}</Label>
                <Input
                  disabled
                  id="preview-identifier"
                  placeholder={identifierPlaceholder}
                  type={identifierType}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preview-password">Password</Label>
                  {config.showForgotPassword && (
                    <a
                      className="text-primary text-sm hover:underline"
                      href={config.forgotPasswordUrl}
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input
                  disabled
                  id="preview-password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>

              {/* Remember Me */}
              {config.showRememberMe && (
                <div className="flex items-center space-x-2">
                  <Checkbox disabled id="preview-remember-me" />
                  <Label className="text-sm" htmlFor="preview-remember-me">
                    Remember me
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <Button className="w-full" disabled type="submit">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Summary */}
      <div className="mt-4 rounded-md bg-muted/50 p-3 text-muted-foreground text-xs">
        <p className="mb-1 font-medium">Current Configuration:</p>
        <ul className="list-inside list-disc space-y-0.5">
          <li>Auth method: {config.authMethod}</li>
          {config.showRememberMe && <li>Remember me: enabled</li>}
          {config.showForgotPassword && <li>Forgot password: enabled</li>}
          {config.enableValidation && (
            <li>
              Validation: min {config.passwordValidation.minLength} chars
              {config.passwordValidation.requireUppercase && ", uppercase"}
              {config.passwordValidation.requireLowercase && ", lowercase"}
              {config.passwordValidation.requireNumbers && ", numbers"}
              {config.passwordValidation.requireSymbols && ", symbols"}
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function getPlaceholder(
  authMethod: BuilderConfiguration["authMethod"]
): string {
  switch (authMethod) {
    case "email":
      return "name@example.com";
    case "username":
      return "johndoe";
    case "phone":
      return "+1234567890";
    default:
      return "";
  }
}

function getInputType(authMethod: BuilderConfiguration["authMethod"]): string {
  switch (authMethod) {
    case "email":
      return "email";
    case "phone":
      return "tel";
    default:
      return "text";
  }
}
