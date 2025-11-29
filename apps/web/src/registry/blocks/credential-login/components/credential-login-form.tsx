import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { cn } from "../lib/utils";
import {
  emailCredentialSchema,
  getPasswordSchema,
  phoneCredentialSchema,
  usernameCredentialSchema,
} from "../lib/validation/index";
import type { CredentialLoginFormProps } from "../types/index";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/**
 * CredentialLoginForm Component
 *
 * A flexible authentication form supporting email, username, or phone-based login
 * Integrates with better-auth SDK for authentication
 *
 * @example
 * ```tsx
 * import { CredentialLoginForm } from '@better-auth-ui/components'
 * import { authClient } from '@/lib/auth-client'
 *
 * <CredentialLoginForm
 *   authMethod="email"
 *   authClient={authClient}
 *   showRememberMe={true}
 *   onSuccess={() => router.push('/dashboard')}
 * />
 * ```
 */
export function CredentialLoginForm({
  authMethod,
  authClient,
  showRememberMe = false,
  showForgotPassword = false,
  forgotPasswordUrl = "/auth/forgot-password",
  enableClientValidation = true,
  passwordValidation,
  onSuccess,
  onError,
  redirectTo,
  className,
  classNames,
  loadingComponent: LoadingComponent,
  disabled = false,
  errorRenderer,
}: CredentialLoginFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Build validation schema based on auth method
  const credentialSchema = useMemo(() => {
    const passwordSchema = enableClientValidation
      ? getPasswordSchema(passwordValidation)
      : z.string().min(1, { message: "auth.errors.required" });

    switch (authMethod) {
      case "email":
        return emailCredentialSchema.extend({
          password: passwordSchema,
        });
      case "username":
        return usernameCredentialSchema.extend({
          password: passwordSchema,
        });
      case "phone":
        return phoneCredentialSchema.extend({
          password: passwordSchema,
        });
      default:
        return emailCredentialSchema.extend({
          password: passwordSchema,
        });
    }
  }, [authMethod, enableClientValidation, passwordValidation]);

  type CredentialFormData = z.infer<typeof credentialSchema>;

  const form = useForm<CredentialFormData>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const performSignIn = async (data: CredentialFormData) => {
    switch (authMethod) {
      case "email":
        return await authClient.signIn.email({
          email: data.identifier,
          password: data.password,
          rememberMe: data.rememberMe,
        });
      case "username":
        return await authClient.signIn.username({
          username: data.identifier,
          password: data.password,
          rememberMe: data.rememberMe,
        });
      case "phone":
        return await authClient.signIn.phone({
          phoneNumber: data.identifier,
          password: data.password,
          rememberMe: data.rememberMe,
        });
      default:
        throw new Error("Invalid auth method");
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: response structure is dynamic and depends on the auth method
  const handleAuthSuccess = async (response: any) => {
    // Handle two-factor authentication redirect
    if (response?.twoFactorRedirect) {
      if (onSuccess) {
        await onSuccess();
      }
      return;
    }

    // Handle successful authentication
    if (onSuccess) {
      await onSuccess();
    }

    // Handle automatic redirect if provided
    if (redirectTo && typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  };

  const handleAuthError = (error: unknown) => {
    // Clear password field on error
    form.setValue("password", "");

    // Parse error and set localized message
    const errorMessage =
      error instanceof Error ? error.message : "auth.errors.serverError";

    // Map error messages to localized keys
    let localizedError = "auth.errors.invalidCredentials";
    if (errorMessage.includes("INVALID_CREDENTIALS")) {
      localizedError = "auth.errors.invalidCredentials";
    } else if (errorMessage.includes("USER_NOT_FOUND")) {
      localizedError = "auth.errors.userNotFound";
    } else if (errorMessage.includes("ACCOUNT_LOCKED")) {
      localizedError = "auth.errors.accountLocked";
    } else if (errorMessage.includes("RATE_LIMIT_EXCEEDED")) {
      localizedError = "auth.errors.rateLimitExceeded";
    } else if (errorMessage.includes("NETWORK")) {
      localizedError = "auth.errors.networkError";
    }

    setAuthError(localizedError);

    // Call custom error handler if provided
    if (onError) {
      onError({
        code: "INVALID_CREDENTIALS",
        message: t(localizedError),
        timestamp: new Date().toISOString(),
      });
    }
  };

  const onSubmit = async (data: CredentialFormData) => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const response = await performSignIn(data);
      await handleAuthSuccess(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get label based on auth method
  const identifierLabel = useMemo(() => {
    switch (authMethod) {
      case "email":
        return t("auth.email");
      case "username":
        return t("auth.username");
      case "phone":
        return t("auth.phoneNumber");
      default:
        return t("auth.email");
    }
  }, [authMethod, t]);

  // Get placeholder based on auth method
  const identifierPlaceholder = useMemo(() => {
    switch (authMethod) {
      case "email":
        return "you@example.com";
      case "username":
        return "johndoe";
      case "phone":
        return "+12025551234";
      default:
        return "you@example.com";
    }
  }, [authMethod]);

  const autoComplete = useMemo(() => {
    switch (authMethod) {
      case "email":
        return "email";
      case "username":
        return "username";
      case "phone":
        return "tel";
      default:
        return "email";
    }
  }, [authMethod]);

  return (
    <div className={cn("space-y-6", className)}>
      <Form {...form}>
        <form
          className={cn("space-y-4", classNames?.form)}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Identifier Field (Email/Username/Phone) */}
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={classNames?.label}>
                  {identifierLabel}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete={autoComplete}
                    className={classNames?.input}
                    disabled={disabled || isSubmitting}
                    placeholder={identifierPlaceholder}
                    type={authMethod === "email" ? "email" : "text"}
                  />
                </FormControl>
                <FormMessage className={classNames?.error} />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className={classNames?.label}>
                    {t("auth.password")}
                  </FormLabel>
                  {showForgotPassword && (
                    <a
                      className={cn(
                        "text-primary text-sm hover:underline",
                        classNames?.link
                      )}
                      href={forgotPasswordUrl}
                      tabIndex={-1}
                    >
                      {t("auth.forgotPassword")}
                    </a>
                  )}
                </div>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="current-password"
                    className={classNames?.input}
                    disabled={disabled || isSubmitting}
                    placeholder="••••••••"
                    type="password"
                  />
                </FormControl>
                <FormMessage className={classNames?.error} />
              </FormItem>
            )}
          />

          {/* Remember Me Checkbox */}
          {showRememberMe && (
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      className={classNames?.checkbox}
                      disabled={disabled || isSubmitting}
                      id="remember-me"
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label
                    className={cn(
                      "cursor-pointer font-normal text-sm",
                      classNames?.label
                    )}
                    htmlFor="remember-me"
                  >
                    {t("auth.rememberMe")}
                  </Label>
                </FormItem>
              )}
            />
          )}

          {/* Error Message */}
          {authError && (
            <div
              className={cn(
                "font-medium text-destructive text-sm",
                classNames?.error
              )}
              role="alert"
            >
              {errorRenderer
                ? errorRenderer({
                    code: "INVALID_CREDENTIALS",
                    message: t(authError),
                    timestamp: new Date().toISOString(),
                  })
                : t(authError)}
            </div>
          )}

          {/* Submit Button */}
          <Button
            className={cn("w-full", classNames?.button)}
            disabled={disabled || isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                {LoadingComponent ? (
                  <LoadingComponent />
                ) : (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("auth.signingIn")}
              </>
            ) : (
              t("auth.signIn")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
