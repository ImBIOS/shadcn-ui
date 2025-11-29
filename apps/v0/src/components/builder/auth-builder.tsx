/**
 * Auth Builder Component
 *
 * Main container component for the credential login builder UI.
 * Combines options sidebar, live preview, and installation instructions.
 *
 * @module @imbios/ui-web/builder
 * Task: T062 [US2] Create auth-builder.tsx main container component
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBuilderState } from "@/lib/builder/builder-state";
import { BuilderOptions } from "./builder-options";
import { BuilderPreview } from "./builder-preview";
import { InstallationTabs } from "./installation-tabs";

// ============================================================================
// Component
// ============================================================================

/**
 * AuthBuilder Component
 *
 * Main builder UI that integrates configuration, preview, and installation.
 */
export function AuthBuilder() {
  const { config, actions } = useBuilderState();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">
          Credential Login Builder
        </h1>
        <p className="mt-2 text-muted-foreground">
          Configure your authentication form and get installation instructions
          for shadcn CLI or NPM package.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Left Sidebar - Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Customize your credential login form options
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <BuilderOptions actions={actions} config={config} />
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Preview & Installation */}
        <div className="space-y-8">
          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your form looks with current settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BuilderPreview config={config} />
            </CardContent>
          </Card>

          {/* Installation Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>
                Choose your preferred installation method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InstallationTabs config={config} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
