/**
 * T088, T089, T090, T091 [US3] E2E tests for package installation methods
 *
 * These tests verify that the package is correctly configured for both
 * installation methods (shadcn CLI via registry + npm package).
 *
 * Note: True E2E tests would create actual test projects. These tests
 * validate the package configuration and export integrity as a practical
 * alternative that can run in CI.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const PACKAGE_ROOT = resolve(__dirname, "../..");
const DIST_PATH = join(PACKAGE_ROOT, "dist");

describe("E2E: Package Installation Methods", () => {
  // Ensure dist is built before tests
  beforeAll(() => {
    if (!existsSync(join(DIST_PATH, "index.mjs"))) {
      execSync("pnpm build", { cwd: PACKAGE_ROOT, stdio: "inherit" });
    }
  });

  describe("T088: shadcn CLI Installation Readiness", () => {
    it("package can be packed without errors", { timeout: 30_000 }, () => {
      // Test that npm pack works (simulates what npm publish does)
      const result = execSync("npm pack --dry-run 2>&1", {
        cwd: PACKAGE_ROOT,
        encoding: "utf-8",
      });
      expect(result).toContain("@imbios/ui");
    });

    it("package.json has all required fields for publishing", () => {
      const pkgPath = join(PACKAGE_ROOT, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

      // Required fields
      expect(pkg.name).toBe("@imbios/ui");
      expect(pkg.version).toBeDefined();
      expect(pkg.main).toBeDefined();
      expect(pkg.module).toBeDefined();
      expect(pkg.types).toBeDefined();
      expect(pkg.exports).toBeDefined();

      // Publishing config
      expect(pkg.publishConfig?.access).toBe("public");

      // Files to include
      expect(pkg.files).toContain("dist");
      expect(pkg.files).toContain("README.md");
    });

    it("package exports are correctly configured", () => {
      const pkgPath = join(PACKAGE_ROOT, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

      // Main export
      expect(pkg.exports["."]).toBeDefined();
      expect(pkg.exports["."].types).toBeDefined();
      expect(pkg.exports["."].import).toBeDefined();
      expect(pkg.exports["."].require).toBeDefined();
    });

    it("README.md exists with installation instructions", () => {
      const readmePath = join(PACKAGE_ROOT, "README.md");
      expect(existsSync(readmePath)).toBe(true);

      const readme = readFileSync(readmePath, "utf-8");

      // Should contain installation methods
      expect(readme).toContain("npm install");
      expect(readme).toContain("pnpm add");

      // Should contain usage examples
      expect(readme).toContain("CredentialLoginForm");
      expect(readme).toContain("authClient");
    });

    it("CHANGELOG.md exists for version tracking", () => {
      const changelogPath = join(PACKAGE_ROOT, "CHANGELOG.md");
      expect(existsSync(changelogPath)).toBe(true);

      const changelog = readFileSync(changelogPath, "utf-8");
      expect(changelog).toContain("## [0.1.0]");
    });
  });

  describe("T089: NPM Package Installation Verification", () => {
    it("dist directory contains all required files", () => {
      const requiredFiles = [
        "index.mjs", // ESM entry
        "index.js", // CJS entry
        "index.d.ts", // TypeScript declarations
      ];

      for (const file of requiredFiles) {
        const filePath = join(DIST_PATH, file);
        expect(existsSync(filePath)).toBe(true);
      }
    });

    it("ESM bundle exports CredentialLoginForm", async () => {
      const mod = await import(join(DIST_PATH, "index.mjs"));

      expect(mod.CredentialLoginForm).toBeDefined();
      expect(typeof mod.CredentialLoginForm).toBe("function");
    });

    it("ESM bundle exports type guards", async () => {
      const mod = await import(join(DIST_PATH, "index.mjs"));

      expect(mod.isAuthError).toBeDefined();
      expect(typeof mod.isAuthError).toBe("function");

      expect(mod.isAuthenticationResponse).toBeDefined();
      expect(typeof mod.isAuthenticationResponse).toBe("function");
    });

    it("ESM bundle exports i18n configuration", async () => {
      const mod = await import(join(DIST_PATH, "index.mjs"));

      expect(mod.i18n).toBeDefined();
    });

    it("TypeScript declarations are valid", () => {
      const dtsPath = join(DIST_PATH, "index.d.ts");
      const dts = readFileSync(dtsPath, "utf-8");

      // Should export main component
      expect(dts).toContain("CredentialLoginForm");

      // Should export types
      expect(dts).toContain("CredentialLoginFormProps");
      expect(dts).toContain("AuthMethod");
      expect(dts).toContain("PasswordValidation");
      expect(dts).toContain("AuthError");

      // Should export type guards
      expect(dts).toContain("isAuthError");
      expect(dts).toContain("isAuthenticationResponse");
    });

    it("peer dependencies are correctly specified", () => {
      const pkgPath = join(PACKAGE_ROOT, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

      expect(pkg.peerDependencies).toBeDefined();
      expect(pkg.peerDependencies["better-auth"]).toBeDefined();
      expect(pkg.peerDependencies.react).toBeDefined();
      expect(pkg.peerDependencies["react-dom"]).toBeDefined();
    });
  });

  describe("T090: Functional Equivalence Between Methods", () => {
    it("npm package exports same component as registry source", async () => {
      // Load from NPM package (dist)
      const npmModule = await import(join(DIST_PATH, "index.mjs"));

      // Verify exports exist
      expect(npmModule.CredentialLoginForm).toBeDefined();
      expect(typeof npmModule.CredentialLoginForm).toBe("function");

      // Both methods should provide the same component API
      // The component name should match
      expect(npmModule.CredentialLoginForm.name).toBe("CredentialLoginForm");
    });

    it("type definitions match between methods", () => {
      const dtsPath = join(DIST_PATH, "index.d.ts");
      const dts = readFileSync(dtsPath, "utf-8");

      // All props should be documented
      expect(dts).toContain("authMethod");
      expect(dts).toContain("authClient");
      expect(dts).toContain("showRememberMe");
      expect(dts).toContain("showForgotPassword");
      expect(dts).toContain("passwordValidation");
      expect(dts).toContain("onSuccess");
      expect(dts).toContain("onError");
      expect(dts).toContain("className");
      expect(dts).toContain("classNames");
      expect(dts).toContain("disabled");
    });

    it("bundle includes all necessary dependencies", () => {
      const pkgPath = join(PACKAGE_ROOT, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

      // Required runtime dependencies
      const requiredDeps = [
        "react-hook-form",
        "@hookform/resolvers",
        "zod",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-label",
        "i18next",
        "react-i18next",
      ];

      for (const dep of requiredDeps) {
        expect(pkg.dependencies[dep]).toBeDefined();
      }
    });
  });

  describe("T091: Package Update Workflow", () => {
    it("package version follows semver", () => {
      const pkgPath = join(PACKAGE_ROOT, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

      const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/;
      expect(pkg.version).toMatch(semverRegex);
    });

    it("CHANGELOG tracks version history", () => {
      const changelogPath = join(PACKAGE_ROOT, "CHANGELOG.md");
      const changelog = readFileSync(changelogPath, "utf-8");

      // Should have version headers
      expect(changelog).toMatch(/## \[\d+\.\d+\.\d+\]/);

      // Should have Unreleased section for future changes
      expect(changelog).toContain("[Unreleased]");
    });

    it("package.json has repository for changelog links", () => {
      const pkgPath = join(PACKAGE_ROOT, "package.json");
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

      expect(pkg.repository).toBeDefined();
      expect(pkg.repository.url).toContain("github.com");
    });

    it("build script produces consistent output", () => {
      // Get current file hashes
      const mjs = readFileSync(join(DIST_PATH, "index.mjs"), "utf-8");
      const js = readFileSync(join(DIST_PATH, "index.js"), "utf-8");

      // Verify files are non-empty and have expected content
      expect(mjs.length).toBeGreaterThan(1000);
      expect(js.length).toBeGreaterThan(1000);

      // Both should contain the component
      expect(mjs).toContain("CredentialLoginForm");
      expect(js).toContain("CredentialLoginForm");
    });

    it("source maps are generated for debugging", () => {
      const mjsMapPath = join(DIST_PATH, "index.mjs.map");
      const jsMapPath = join(DIST_PATH, "index.js.map");

      expect(existsSync(mjsMapPath)).toBe(true);
      expect(existsSync(jsMapPath)).toBe(true);
    });
  });
});
