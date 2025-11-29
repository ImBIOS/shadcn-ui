/**
 * Code preview component with syntax highlighting
 * @module components/builder/code-preview
 */

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Regex literals moved to top level for performance
const IMPORT_REGEX =
  /^(import\s+)(\{[^}]+\}|\*\s+as\s+\w+|\w+)(\s+from\s+)(['"][^'"]+['"])/;
const EXPORT_DEFAULT_REGEX = /export default\s+/;

type CodePreviewProps = {
  code: string;
  language: "bash" | "typescript" | "json";
  title?: string;
  showCopy?: boolean;
};

export function CodePreview({
  code,
  language,
  title,
  showCopy = true,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard", {
        description: "Code has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (_error) {
      toast.error("Failed to copy", {
        description: "Could not copy code to clipboard",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-mono text-sm">{title || language}</CardTitle>
        {showCopy && (
          <Button
            className="h-8 w-8 p-0"
            onClick={handleCopy}
            size="sm"
            variant="ghost"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded bg-muted p-4 text-sm">
          <code>{highlightCode(code, language)}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

function highlightCode(code: string, language: string): React.ReactNode {
  if (language === "bash") {
    const lines = code.split("\n");
    return lines.map((line, i) => {
      const isComment = line.startsWith("#");
      let isCommand = false;

      if (!isComment) {
        isCommand =
          line.startsWith("$") ||
          line.startsWith("npx") ||
          line.startsWith("pnpm");
      }

      let content: React.ReactNode;
      if (isComment) {
        content = <span className="text-muted-foreground">{line}</span>;
      } else if (isCommand) {
        content = (
          <>
            <span className="text-green-400">{line.split(" ")[0]}</span>
            <span className="text-foreground">
              {" "}
              {line.split(" ").slice(1).join(" ")}
            </span>
          </>
        );
      } else {
        content = <span className="text-foreground">{line}</span>;
      }

      return (
        <span className="block" key={`bash-${line.substring(0, 10)}-${i}`}>
          {content}
        </span>
      );
    });
  }

  if (language === "typescript") {
    const lines = code.split("\n");
    return lines.map((line, i) => (
      <span className="block" key={`ts-${line.substring(0, 10)}-${i}`}>
        {highlightTypescriptLine(line)}
      </span>
    ));
  }

  return <span className="text-foreground">{code}</span>;
}

function highlightTypescriptLine(line: string): React.ReactNode {
  // Simple keyword highlighting
  const keywords = [
    "import",
    "export",
    "from",
    "const",
    "function",
    "return",
    "default",
    "type",
    "interface",
  ];
  const jsxKeywords = ["true", "false", "null", "undefined"];

  let result = line;

  // Check for import statements
  if (line.trim().startsWith("import")) {
    const importMatch = line.match(IMPORT_REGEX);
    if (importMatch) {
      return (
        <>
          <span className="text-purple-400">{importMatch[1]}</span>
          <span className="text-yellow-300">{importMatch[2]}</span>
          <span className="text-purple-400">{importMatch[3]}</span>
          <span className="text-green-300">{importMatch[4]}</span>
        </>
      );
    }
  }

  // Check for export default
  if (line.trim().startsWith("export default")) {
    return (
      <>
        <span className="text-purple-400">export default </span>
        <span className="text-foreground">
          {line.replace(EXPORT_DEFAULT_REGEX, "")}
        </span>
      </>
    );
  }

  // Check for JSX
  if (line.includes("<") && line.includes(">")) {
    // Simple JSX highlighting - just highlight the tags
    result = result.replace(
      /(<\/?)([a-zA-Z][a-zA-Z0-9]*)/g,
      '<span className="text-red-400">$1</span><span className="text-blue-400">$2</span>'
    );
  }

  // Highlight keywords
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    result = result.replace(
      regex,
      `<span className="text-purple-400">${keyword}</span>`
    );
  }

  // Highlight JSX keywords
  for (const keyword of jsxKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    result = result.replace(
      regex,
      `<span className="text-blue-300">${keyword}</span>`
    );
  }

  // Return the highlighted line with CSS classes
  // This is safe because we're only adding CSS classes, not arbitrary HTML
  return <span>{result}</span>;
}
