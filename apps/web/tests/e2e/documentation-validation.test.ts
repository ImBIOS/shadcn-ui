/**
 * T102, T103, T104 [US4] E2E tests for documentation validation
 *
 * These tests validate that framework-specific documentation exists and is
 * properly structured. True E2E tests would create actual test projects in
 * each framework - these tests validate documentation completeness as a
 * practical CI-ready alternative.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const DOCS_PATH = resolve(__dirname, "../../content/docs");

describe("E2E: Framework Documentation Validation", () => {
  describe("T102: Next.js Integration Documentation", () => {
    it("Next.js installation guide exists", () => {
      const filePath = join(DOCS_PATH, "installation/nextjs.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("Next.js installation guide has required sections", () => {
      const filePath = join(DOCS_PATH, "installation/nextjs.mdx");
      const content = readFileSync(filePath, "utf-8");

      // Required sections
      expect(content).toContain("# Next.js Installation");
      expect(content).toContain("better-auth");
      expect(content).toContain("CredentialLoginForm");
      expect(content).toContain("authClient");
    });

    it("Next.js example exists", () => {
      const filePath = join(DOCS_PATH, "examples/nextjs-example.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("Next.js example has complete code samples", () => {
      const filePath = join(DOCS_PATH, "examples/nextjs-example.mdx");
      const content = readFileSync(filePath, "utf-8");

      // Should have complete examples
      expect(content).toContain("'use client'");
      expect(content).toContain("useRouter");
      expect(content).toContain("CredentialLoginForm");
      expect(content).toContain("authMethod");
    });

    it("Next.js middleware guide exists", () => {
      const filePath = join(DOCS_PATH, "guides/nextjs-middleware.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("Next.js middleware guide covers route protection", () => {
      const filePath = join(DOCS_PATH, "guides/nextjs-middleware.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("middleware");
      expect(content).toContain("NextRequest");
      expect(content).toContain("redirect");
      expect(content).toContain("protected");
    });
  });

  describe("T103: Vite Integration Documentation", () => {
    it("Vite installation guide exists", () => {
      const filePath = join(DOCS_PATH, "installation/vite.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("Vite installation guide has required sections", () => {
      const filePath = join(DOCS_PATH, "installation/vite.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("Vite");
      expect(content).toContain("React Router");
      expect(content).toContain("CredentialLoginForm");
      expect(content).toContain("authClient");
    });

    it("Vite example exists", () => {
      const filePath = join(DOCS_PATH, "examples/vite-example.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("Vite example has complete code samples", () => {
      const filePath = join(DOCS_PATH, "examples/vite-example.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("useNavigate");
      expect(content).toContain("react-router");
      expect(content).toContain("CredentialLoginForm");
    });

    it("Vite router guide exists", () => {
      const filePath = join(DOCS_PATH, "guides/vite-router.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("Vite router guide covers route protection", () => {
      const filePath = join(DOCS_PATH, "guides/vite-router.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("loader");
      expect(content).toContain("redirect");
      expect(content).toContain("requireAuth");
    });
  });

  describe("T104: TanStack Start Integration Documentation", () => {
    it("TanStack Start installation guide exists", () => {
      const filePath = join(DOCS_PATH, "installation/tanstack-start.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("TanStack Start installation guide has required sections", () => {
      const filePath = join(DOCS_PATH, "installation/tanstack-start.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("TanStack Start");
      expect(content).toContain("createFileRoute");
      expect(content).toContain("CredentialLoginForm");
      expect(content).toContain("authClient");
    });

    it("TanStack Start example exists", () => {
      const filePath = join(DOCS_PATH, "examples/tanstack-example.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("TanStack Start example has complete code samples", () => {
      const filePath = join(DOCS_PATH, "examples/tanstack-example.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("createFileRoute");
      expect(content).toContain("useNavigate");
      expect(content).toContain("beforeLoad");
      expect(content).toContain("CredentialLoginForm");
    });

    it("TanStack route guards guide exists", () => {
      const filePath = join(DOCS_PATH, "guides/tanstack-route-guards.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("TanStack route guards guide covers beforeLoad", () => {
      const filePath = join(DOCS_PATH, "guides/tanstack-route-guards.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("beforeLoad");
      expect(content).toContain("redirect");
      expect(content).toContain("useRouteContext");
    });
  });

  describe("Installation Index", () => {
    it("Installation index exists", () => {
      const filePath = join(DOCS_PATH, "installation/index.mdx");
      expect(existsSync(filePath)).toBe(true);
    });

    it("Installation index links to all frameworks", () => {
      const filePath = join(DOCS_PATH, "installation/index.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("Next.js");
      expect(content).toContain("Vite");
      expect(content).toContain("TanStack");
    });

    it("Installation index covers both installation methods", () => {
      const filePath = join(DOCS_PATH, "installation/index.mdx");
      const content = readFileSync(filePath, "utf-8");

      expect(content).toContain("shadcn");
      expect(content).toContain("NPM");
      expect(content).toContain("pnpm add");
    });
  });

  describe("Documentation Completeness", () => {
    const expectedFiles = [
      "installation/index.mdx",
      "installation/nextjs.mdx",
      "installation/vite.mdx",
      "installation/tanstack-start.mdx",
      "examples/nextjs-example.mdx",
      "examples/vite-example.mdx",
      "examples/tanstack-example.mdx",
      "guides/nextjs-middleware.mdx",
      "guides/vite-router.mdx",
      "guides/tanstack-route-guards.mdx",
    ];

    it.each(expectedFiles)("%s exists", (file) => {
      const filePath = join(DOCS_PATH, file);
      expect(existsSync(filePath)).toBe(true);
    });

    it("all documentation files have frontmatter", () => {
      for (const file of expectedFiles) {
        const filePath = join(DOCS_PATH, file);
        const content = readFileSync(filePath, "utf-8");

        expect(content).toMatch(/^---\ntitle:/);
        expect(content).toContain("description:");
      }
    });

    it("all documentation files have content after frontmatter", () => {
      for (const file of expectedFiles) {
        const filePath = join(DOCS_PATH, file);
        const content = readFileSync(filePath, "utf-8");

        // Should have content after the frontmatter
        const parts = content.split("---");
        expect(parts.length).toBeGreaterThanOrEqual(3);
        expect(parts[2].trim().length).toBeGreaterThan(100);
      }
    });
  });
});
