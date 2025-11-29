/**
 * Builder Route
 *
 * TanStack Start route for the credential login builder UI.
 *
 * @module @imbios/ui-web/routes/builder
 * Task: T061 [US2] Create builder route apps/v0/src/routes/builder/$.tsx
 */

import { createFileRoute } from "@tanstack/react-router";
import { AuthBuilder } from "@/components/builder/auth-builder";

export const Route = createFileRoute("/builder/")({
  component: BuilderPage,
  head: () => ({
    meta: [
      {
        title: "Credential Login Builder | Better Auth UI",
      },
      {
        name: "description",
        content:
          "Configure and preview credential login components for better-auth. Get installation instructions for shadcn CLI or NPM package.",
      },
    ],
  }),
});

function BuilderPage() {
  return <AuthBuilder />;
}
