/**
 * Login Component Page with Embedded Builder
 *
 * This page demonstrates a login form with an integrated
 * builder interface for customization and configuration.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GenericBuilder } from "../components/builder/generic-builder";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
  validateSearch: (search: Record<string, string>) => ({
    tab: search.tab === "builder" ? "builder" : "preview",
  }),
});

function LoginComponent() {
  const [activeTab, setActiveTab] = useState<"preview" | "builder">("preview");
  const searchParams = Route.useSearch();

  useEffect(() => {
    if (searchParams.tab === "builder") {
      setActiveTab("builder");
    }
  }, [searchParams.tab]);

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

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label className="font-normal text-sm" htmlFor="remember">
                      Remember me
                    </Label>
                  </div>
                  <Button className="w-full">Sign In</Button>
                  <div className="text-center">
                    <a
                      className="text-primary text-sm hover:underline"
                      href="/auth/forgot-password"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

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
        <GenericBuilder
          componentType="auth"
          description="Configure your login form and get installation instructions"
          title="Login Form Builder"
        />
      )}
    </div>
  );
}
