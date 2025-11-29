/**
 * Components Index Page
 *
 * This page lists all available components with links to their respective
 * pages with embedded builders.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/components")({
  component: ComponentsPage,
});

function ComponentsPage() {
  const components = [
    {
      id: "login",
      title: "Login Form",
      description:
        "A customizable login form with email/username authentication options",
      path: "/login",
      status: "ready",
      category: "Authentication",
    },
    {
      id: "signup",
      title: "Sign Up Form",
      description:
        "A comprehensive sign up form with validation and terms acceptance",
      path: "/signup",
      status: "ready",
      category: "Authentication",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge variant="default">Ready</Badge>;
      case "coming-soon":
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">UI Components</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and customize our collection of UI components with integrated
          builders
        </p>
      </div>

      {/* Components Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {components.map((component) => (
          <Card className="h-full" key={component.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{component.title}</CardTitle>
                {getStatusBadge(component.status)}
              </div>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4">
              <div>
                <Badge className="mb-2" variant="outline">
                  {component.category}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to={component.path}>View Component</Link>
                </Button>
                {component.status === "ready" && (
                  <Button asChild variant="outline">
                    <Link to={`${component.path}?tab=builder`}>Builder</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Integrated Component Builders</CardTitle>
            <CardDescription>
              Each component page includes an embedded builder that allows you
              to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 md:grid-cols-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Customize component appearance and behavior</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Preview changes in real-time</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Generate installation code</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Export configuration for your project</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
