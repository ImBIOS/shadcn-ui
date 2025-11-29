/**
 * Signup Component Page with Embedded Builder
 *
 * This page demonstrates a signup form with an integrated
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

export const Route = createFileRoute("/signup")({
  component: SignupComponent,
  validateSearch: (search: Record<string, string>) => ({
    tab: search.tab === "builder" ? "builder" : "preview",
  }),
});

function SignupComponent() {
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
        <h1 className="font-bold text-3xl tracking-tight">Sign Up Component</h1>
        <p className="mt-2 text-muted-foreground">
          Preview and customize sign up form with the integrated builder
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
              See how the sign up form looks with default settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[500px] items-center justify-center p-6">
              <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                  <h1 className="font-bold text-2xl">Create an account</h1>
                  <p className="mt-2 text-muted-foreground">
                    Enter your information to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label className="font-normal text-sm" htmlFor="terms">
                      I agree to Terms of Service and Privacy Policy
                    </Label>
                  </div>
                  <Button className="w-full">Create Account</Button>
                </div>

                <p className="mt-6 text-center text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <a
                    className="font-medium text-primary hover:underline"
                    href="/login"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <GenericBuilder
          componentType="auth"
          description="Configure your sign up form and get installation instructions"
          title="Sign Up Form Builder"
        />
      )}
    </div>
  );
}
