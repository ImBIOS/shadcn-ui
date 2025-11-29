import { loader } from "fumadocs-core/source";
// biome-ignore lint/performance/noNamespaceImport: Dynamic icon loading
import * as icons from "lucide-static";
import { docs } from "@/../.source/server";

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: "/docs",
  icon(icon) {
    if (!icon) {
      return;
    }

    if (icon in icons) {
      // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Dynamic icon loading
      return icons[icon as keyof typeof icons];
    }
  },
});
