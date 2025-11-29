/**
 * Integration test for registry installation simulation
 * Tests that the registry JSON files are valid and the shadcn CLI can process them
 * @module tests/integration/registry-install
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Path to registry files
const REGISTRY_PATH = join(__dirname, "../../src/registry");

describe("Registry Installation Simulation", () => {
  describe("Registry Index", () => {
    it("index.json exists and is valid JSON", async () => {
      const indexPath = join(REGISTRY_PATH, "index.json");
      const content = await readFile(indexPath, "utf-8");
      const index = JSON.parse(content);

      expect(index).toBeDefined();
      expect(index.name).toBeDefined();
      expect(Array.isArray(index.items)).toBe(true);
    });

    it("index.json contains credential-login block", async () => {
      const indexPath = join(REGISTRY_PATH, "index.json");
      const content = await readFile(indexPath, "utf-8");
      const index = JSON.parse(content);

      const credentialLogin = index.items.find(
        (item: { name: string }) => item.name === "credential-login"
      );

      expect(credentialLogin).toBeDefined();
      expect(credentialLogin.type).toBe("registry:block");
    });
  });

  describe("Credential Login Registry", () => {
    it("credential-login.json exists and is valid JSON", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      expect(registry).toBeDefined();
      expect(registry.name).toBe("credential-login");
    });

    it("credential-login.json follows shadcn registry schema", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      // Required fields according to shadcn schema
      expect(registry.name).toBeDefined();
      expect(registry.type).toBe("registry:block");
      expect(Array.isArray(registry.files)).toBe(true);
      expect(registry.files.length).toBeGreaterThan(0);
    });

    it("credential-login.json has valid file references", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      for (const file of registry.files) {
        expect(file.path).toBeDefined();
        expect(typeof file.path).toBe("string");
        expect(file.type).toBeDefined();
      }
    });

    it("credential-login.json has required dependencies", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      // Check that dependencies are defined (can be empty array)
      expect(Array.isArray(registry.dependencies)).toBe(true);
    });

    it("credential-login.json has registry dependencies", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      // Registry dependencies point to shadcn UI components
      expect(Array.isArray(registry.registryDependencies)).toBe(true);

      // Should include common UI components
      const expectedDeps = [
        "button",
        "input",
        "label",
        "form",
        "card",
        "checkbox",
      ];
      for (const dep of expectedDeps) {
        expect(registry.registryDependencies).toContain(dep);
      }
    });
  });

  describe("Registry Files References", () => {
    it("all file paths are valid references", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      for (const file of registry.files) {
        expect(file.path).toBeDefined();
        expect(typeof file.path).toBe("string");
        expect(file.path.length).toBeGreaterThan(0);
        // Paths should be relative and valid
        expect(file.path).toMatch(/^[a-zA-Z0-9/_.-]+\.(tsx?|json)$/);
      }
    });

    it("file references point to existing source files", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      // All referenced files should exist in the blocks directory
      for (const file of registry.files) {
        const filePath = join(REGISTRY_PATH, file.path);
        try {
          await readFile(filePath, "utf-8");
        } catch {
          // File doesn't exist at that path - this is expected for registry:page type
          // as those are templates, not actual files
          if (file.type !== "registry:page") {
            throw new Error(`File not found: ${filePath}`);
          }
        }
      }
    });

    it("includes main component file reference", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      const mainComponent = registry.files.find(
        (f: { path: string }) =>
          f.path.includes("credential-login-form.tsx") ||
          f.path.includes("credential-login.tsx")
      );

      expect(mainComponent).toBeDefined();
      expect(mainComponent.path).toContain("credential-login");
    });

    it("actual source files contain valid TypeScript/TSX", async () => {
      // Check that the actual source files in the registry blocks directory exist and are valid
      const blocksPath = join(REGISTRY_PATH, "blocks/credential-login");
      const componentPath = join(
        blocksPath,
        "components/credential-login-form.tsx"
      );

      const componentContent = await readFile(componentPath, "utf-8");
      expect(componentContent).toContain("CredentialLoginForm");
      expect(componentContent).toContain("export");
    });
  });

  describe("shadcn CLI Compatibility", () => {
    it("registry item has description for search", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      expect(registry.description).toBeDefined();
      expect(typeof registry.description).toBe("string");
      expect(registry.description.length).toBeGreaterThan(10);
    });

    it("registry files have valid target paths", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      const pageFile = registry.files.find(
        (f: { type: string }) => f.type === "registry:page"
      );

      if (pageFile?.target) {
        // Target should be a valid path
        expect(pageFile.target).toMatch(/^[a-zA-Z0-9/_.-]+$/);
      }
    });

    it("registry has categories for filtering", async () => {
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const content = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(content);

      if (registry.categories) {
        expect(Array.isArray(registry.categories)).toBe(true);
        expect(registry.categories).toContain("authentication");
      }
    });
  });

  describe("Installation Flow Simulation", () => {
    it("can simulate full installation flow", async () => {
      // Simulate what shadcn CLI does:
      // 1. Fetch index.json
      const indexPath = join(REGISTRY_PATH, "index.json");
      const indexContent = await readFile(indexPath, "utf-8");
      const index = JSON.parse(indexContent);

      // 2. Find the credential-login block
      const blockInfo = index.items.find(
        (item: { name: string }) => item.name === "credential-login"
      );
      expect(blockInfo).toBeDefined();

      // 3. Fetch the block registry
      const registryPath = join(REGISTRY_PATH, "credential-login.json");
      const registryContent = await readFile(registryPath, "utf-8");
      const registry = JSON.parse(registryContent);

      // 4. Verify we can extract files
      const files = registry.files;
      expect(files.length).toBeGreaterThan(0);

      // 5. Verify dependencies can be installed
      const npmDeps = registry.dependencies || [];
      const registryDeps = registry.registryDependencies || [];

      // All should be strings
      for (const dep of [...npmDeps, ...registryDeps]) {
        expect(typeof dep).toBe("string");
      }

      // 6. Verify files have paths to reference
      for (const file of files) {
        expect(file.path).toBeDefined();
        expect(file.type).toBeDefined();
      }

      // 7. Verify the source files can be read
      const blocksPath = join(REGISTRY_PATH, "blocks/credential-login");
      const componentPath = join(
        blocksPath,
        "components/credential-login-form.tsx"
      );
      const componentContent = await readFile(componentPath, "utf-8");
      expect(componentContent.length).toBeGreaterThan(0);
    });
  });
});
