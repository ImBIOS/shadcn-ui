/**
 * Builder Options Component
 *
 * Configuration sidebar for the credential login builder UI.
 * Allows users to toggle auth methods and features.
 *
 * @module @imbios/ui-web/builder
 * Task: T063 [US2] Create builder-options.tsx configuration sidebar
 */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  AuthMethod,
  BuilderActions,
  BuilderConfiguration,
} from "@/lib/builder/builder-state";

// ============================================================================
// Types
// ============================================================================

type BuilderOptionsProps = {
  config: BuilderConfiguration;
  actions: BuilderActions;
};

// ============================================================================
// Component
// ============================================================================

/**
 * BuilderOptions Component
 *
 * Renders configuration options for the credential login builder.
 */
export function BuilderOptions({ config, actions }: BuilderOptionsProps) {
  const handleAuthMethodChange = (method: AuthMethod) => {
    actions.setAuthMethod(method);
  };

  const handleMinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(value)) {
      actions.updatePasswordValidation({ minLength: value });
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Auth Method Selection */}
      <fieldset>
        <legend className="mb-3 font-semibold text-foreground text-sm">
          Authentication Method
        </legend>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              checked={config.authMethod === "email"}
              className="h-4 w-4 border-border text-primary focus:ring-primary"
              id="auth-email"
              name="authMethod"
              onChange={() => handleAuthMethodChange("email")}
              type="radio"
              value="email"
            />
            <Label htmlFor="auth-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              checked={config.authMethod === "username"}
              className="h-4 w-4 border-border text-primary focus:ring-primary"
              id="auth-username"
              name="authMethod"
              onChange={() => handleAuthMethodChange("username")}
              type="radio"
              value="username"
            />
            <Label htmlFor="auth-username">Username</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              checked={config.authMethod === "phone"}
              className="h-4 w-4 border-border text-primary focus:ring-primary"
              id="auth-phone"
              name="authMethod"
              onChange={() => handleAuthMethodChange("phone")}
              type="radio"
              value="phone"
            />
            <Label htmlFor="auth-phone">Phone Number</Label>
          </div>
        </div>
      </fieldset>

      {/* Optional Features */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground text-sm">
          Optional Features
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={config.showRememberMe}
              id="remember-me"
              onCheckedChange={() => actions.toggleRememberMe()}
            />
            <Label htmlFor="remember-me">Remember Me</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={config.showForgotPassword}
              id="forgot-password"
              onCheckedChange={() => actions.toggleForgotPassword()}
            />
            <Label htmlFor="forgot-password">Forgot Password</Label>
          </div>
        </div>
      </div>

      {/* Password Validation */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground text-sm">
          Password Validation
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={config.enableValidation}
              id="enable-validation"
              onCheckedChange={() => actions.toggleValidation()}
            />
            <Label htmlFor="enable-validation">Enable Validation</Label>
          </div>

          {config.enableValidation && (
            <div className="ml-6 space-y-3 border-border border-l-2 pl-4">
              <div className="space-y-1.5">
                <Label htmlFor="min-length">Minimum Length</Label>
                <Input
                  className="w-24"
                  id="min-length"
                  max={128}
                  min={4}
                  onChange={handleMinLengthChange}
                  type="number"
                  value={config.passwordValidation.minLength}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={config.passwordValidation.requireUppercase}
                    id="require-uppercase"
                    onCheckedChange={(checked) =>
                      actions.updatePasswordValidation({
                        requireUppercase: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="require-uppercase">Require Uppercase</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={config.passwordValidation.requireLowercase}
                    id="require-lowercase"
                    onCheckedChange={(checked) =>
                      actions.updatePasswordValidation({
                        requireLowercase: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="require-lowercase">Require Lowercase</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={config.passwordValidation.requireNumbers}
                    id="require-numbers"
                    onCheckedChange={(checked) =>
                      actions.updatePasswordValidation({
                        requireNumbers: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="require-numbers">Require Numbers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={config.passwordValidation.requireSymbols}
                    id="require-symbols"
                    onCheckedChange={(checked) =>
                      actions.updatePasswordValidation({
                        requireSymbols: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="require-symbols">Require Symbols</Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <div className="border-border border-t pt-4">
        <Button
          className="w-full"
          onClick={() => actions.resetConfig()}
          size="sm"
          variant="outline"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
