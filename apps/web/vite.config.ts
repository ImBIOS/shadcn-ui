import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    mdx(await import("./source.config")),
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    alchemy(),
  ],
  build: {
    // Code splitting configuration for better performance
    rollupOptions: {
      output: {
        // Automatic code splitting based on dynamic imports
        // Vite handles chunking automatically for optimal performance
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
    // Target modern browsers for smaller bundles
    target: "esnext",
    // Enable minification
    minify: "esbuild",
    // Source maps for debugging (disable in prod for smaller bundles)
    sourcemap: process.env.NODE_ENV !== "production",
  },
});
