/**
 * Installation Tabs Component
 *
 * Shows installation instructions for both shadcn CLI and npm package methods.
 *
 * @module @imbios/ui-web/builder
 * Task: T065 [US2] Create installation-tabs.tsx with CLI/npm methods
 */

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { BuilderConfiguration } from "@/lib/builder/builder-state";
import {
  generateNpmCommand,
  generateShadcnCommand,
  generateUsageCode,
} from "@/lib/builder/builder-state";
import { CodePreview } from "./code-preview";

// ============================================================================
// Constants
// ============================================================================

const REGISTRY_URL = "https://ui.imbios.dev/r/credential-login";

// ============================================================================
// Types
// ============================================================================

type InstallationTabsProps = {
  /** Current builder configuration */
  config: BuilderConfiguration;
};

type TabId = "shadcn" | "npm";

// ============================================================================
// Component
// ============================================================================

/**
 * InstallationTabs Component
 *
 * Displays installation instructions with tabs for shadcn CLI and npm methods.
 */
export function InstallationTabs({ config }: InstallationTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("npm");

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2 border-border border-b">
        <TabButton
          active={activeTab === "npm"}
          onClick={() => setActiveTab("npm")}
        >
          NPM Package
        </TabButton>
        <TabButton
          active={activeTab === "shadcn"}
          onClick={() => setActiveTab("shadcn")}
        >
          shadcn CLI
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "shadcn" ? (
          <ShadcnTabContent />
        ) : (
          <NpmTabContent config={config} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      className={`rounded-none border-b-2 ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
      size="sm"
      variant="ghost"
    >
      {children}
    </Button>
  );
}

function ShadcnTabContent() {
  return (
    <div className="space-y-6">
      {/* Installation */}
      <div>
        <h4 className="mb-2 font-semibold text-sm">1. Install the component</h4>
        <CodePreview
          code={generateShadcnCommand(REGISTRY_URL)}
          language="bash"
        />
      </div>

      {/* What gets installed */}
      <div>
        <h4 className="mb-2 font-semibold text-sm">2. What gets installed</h4>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <p className="mb-2 text-muted-foreground">
            The following files will be added to your project:
          </p>
          <ul className="space-y-1 font-mono text-xs">
            <li className="text-foreground">
              📄 components/auth/credential-login-form.tsx
            </li>
            <li className="text-muted-foreground">
              📁 components/ui/ (button, input, card, etc. if not present)
            </li>
          </ul>
        </div>
      </div>

      {/* Usage */}
      <div>
        <h4 className="mb-2 font-semibold text-sm">3. Use in your app</h4>
        <CodePreview
          code={`import { CredentialLoginForm } from '@/components/auth/credential-login-form'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  return (
    <CredentialLoginForm authClient={authClient} />
  )
}`}
          language="typescript"
        />
      </div>

      {/* Customization Note */}
      <div className="rounded-lg border border-border bg-amber-500/10 p-4 text-sm">
        <p className="font-medium text-amber-600 dark:text-amber-400">
          💡 Full Customization
        </p>
        <p className="mt-1 text-muted-foreground">
          With shadcn CLI, you own the code. Customize styles, add fields, or
          modify the authentication flow directly in your project files.
        </p>
      </div>
    </div>
  );
}

function NpmTabContent({ config }: { config: BuilderConfiguration }) {
  const usageCode = generateUsageCode(config);

  return (
    <div className="space-y-6">
      {/* Installation */}
      <div>
        <h4 className="mb-2 font-semibold text-sm">1. Install the package</h4>
        <CodePreview code={generateNpmCommand()} language="bash" />
      </div>

      {/* Usage */}
      <div>
        <h4 className="mb-2 font-semibold text-sm">
          2. Use with your current configuration
        </h4>
        <CodePreview code={usageCode} language="typescript" />
      </div>

      {/* Benefits */}
      <div>
        <h4 className="mb-2 font-semibold text-sm">NPM Package Benefits</h4>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>
                <strong className="text-foreground">Automatic updates</strong> -
                Get bug fixes and new features via pnpm update
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>
                <strong className="text-foreground">Prop-based config</strong> -
                No code modification needed for different auth methods
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>
                <strong className="text-foreground">TypeScript support</strong>{" "}
                - Full type definitions included
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Update Note */}
      <div className="rounded-lg border border-border bg-blue-500/10 p-4 text-sm">
        <p className="font-medium text-blue-600 dark:text-blue-400">
          📦 Managed Updates
        </p>
        <p className="mt-1 text-muted-foreground">
          Update to the latest version with:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            pnpm update @imbios/ui
          </code>
        </p>
      </div>
    </div>
  );
}
