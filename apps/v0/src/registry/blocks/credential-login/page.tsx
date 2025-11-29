/**
 * Credential Login Block - Page Wrapper
 *
 * This is a demo/example page showing how to use the CredentialLoginForm component.
 * When installed via shadcn CLI, this file is copied to your project.
 *
 * @example
 * ```bash
 * npx shadcn@latest add "https://ui.imbios.dev/r/credential-login"
 * ```
 */

"use client";

import { CredentialLoginForm } from "./components/credential-login-form";
// import { authClient } from "@/lib/auth-client"; // User provides this

export default function SignInPage() {
  // This is a placeholder - users need to provide their own authClient
  // and navigation logic
  // biome-ignore lint/suspicious/noExplicitAny: Placeholder for user authClient
  const authClient = {} as any; // Replace with actual authClient

  const handleSuccess = () => {
    // Navigate to dashboard or home page
    // Example for Next.js App Router:
    // import { useRouter } from "next/navigation";
    // const router = useRouter();
    // router.push("/dashboard");

    // Example for React Router:
    // import { useNavigate } from "react-router-dom";
    // const navigate = useNavigate();
    // navigate("/dashboard");

    // Example for TanStack Router:
    // import { useNavigate } from "@tanstack/react-router";
    // const navigate = useNavigate();
    // navigate({ to: "/dashboard" });

    console.log("Authentication successful!");
  };

  const handleError = (error: unknown) => {
    console.error("Authentication failed:", error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-2xl">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <CredentialLoginForm
          authClient={authClient}
          authMethod="email"
          forgotPasswordUrl="/auth/forgot-password"
          onError={handleError}
          onSuccess={handleSuccess}
          showForgotPassword={true}
          showRememberMe={true}
        />

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Don't have an account?{" "}
          <a
            className="font-medium text-primary hover:underline"
            href="/auth/sign-up"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
