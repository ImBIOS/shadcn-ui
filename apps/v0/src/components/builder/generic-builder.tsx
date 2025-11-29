/**
 * Generic Builder Component
 *
 * A flexible builder interface that can be used for different component types.
 * This component accepts a component type and renders the appropriate builder.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthBuilder } from "./auth-builder";

// ============================================================================
// Types
// ============================================================================

export type ComponentType = "auth" | "form" | "card" | "button";

type GenericBuilderProps = {
  componentType: ComponentType;
  title?: string;
  description?: string;
};

// ============================================================================
// Component
// ============================================================================

/**
 * GenericBuilder Component
 *
 * Renders the appropriate builder based on the component type.
 */
export function GenericBuilder({
  componentType,
  title,
  description,
}: GenericBuilderProps) {
  const renderBuilder = () => {
    switch (componentType) {
      case "auth":
        return <AuthBuilder />;
      case "form":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Form Builder</CardTitle>
              <CardDescription>
                Configure your form fields and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground">
                Form builder coming soon...
              </div>
            </CardContent>
          </Card>
        );
      case "card":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Card Builder</CardTitle>
              <CardDescription>
                Configure your card layout and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground">
                Card builder coming soon...
              </div>
            </CardContent>
          </Card>
        );
      case "button":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Button Builder</CardTitle>
              <CardDescription>
                Configure your button styles and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground">
                Button builder coming soon...
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Unknown Component Type</CardTitle>
              <CardDescription>
                The component type "{componentType}" is not supported
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground">
                Please select a valid component type
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">
          {title ||
            `${componentType.charAt(0).toUpperCase() + componentType.slice(1)} Builder`}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {description ||
            `Configure your ${componentType} component and get installation instructions`}
        </p>
      </div>

      {/* Builder Content */}
      {renderBuilder()}
    </div>
  );
}
