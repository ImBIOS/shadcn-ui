/**
 * Credential Login Block - Page with Embedded Builder
 *
 * This page demonstrates the CredentialLoginForm component with an integrated
 * builder interface for customization and configuration.
 *
 * @example
 * ```bash
 * npx shadcn@latest add "https://ui.imbios.dev/r/credential-login"
 * ```
 */

"use client";

import { useState } from "react";
import { AuthBuilder } from "../../../components/builder/auth-builder";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { CredentialLoginForm } from "./components/credential-login-form";
// import { authClient } from "@/lib/auth-client"; // User provides this

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState<"preview" | "builder">("preview");

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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">
          Credential Login Component
        </h1>
        <p className="mt-2 text-muted-foreground">
          Preview and customize the credential login form with the integrated
          builder
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex space-x-1 rounded-lg bg-muted p-1">
        <Button
          className="flex-1"
          onClick={() => setActiveTab("preview")}
          variant={activeTab === "preview" ? "default" : "ghost"}
        >
          Component Preview
        </Button>
        <Button
          className="flex-1"
          onClick={() => setActiveTab("builder")}
          variant={activeTab === "builder" ? "default" : "ghost"}
        >
          Customize Builder
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "preview" ? (
        <Card>
          <CardHeader>
            <CardTitle>Component Preview</CardTitle>
            <CardDescription>
              See how the credential login form looks with default settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[500px] items-center justify-center p-6">
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
          </CardContent>
        </Card>
      ) : (
        <AuthBuilder />
      )}
    </div>
  );
}
