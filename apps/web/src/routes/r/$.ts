import { createFileRoute } from "@tanstack/react-router";

// Import file contents as raw strings using Vite's ?raw import
import credentialLoginForm from "../../registry/blocks/credential-login/components/credential-login-form.tsx?raw";
import utils from "../../registry/blocks/credential-login/lib/utils.ts?raw";
import emailSchema from "../../registry/blocks/credential-login/lib/validation/email-schema.ts?raw";
import validationIndex from "../../registry/blocks/credential-login/lib/validation/index.ts?raw";
import passwordSchema from "../../registry/blocks/credential-login/lib/validation/password-schema.ts?raw";
import phoneSchema from "../../registry/blocks/credential-login/lib/validation/phone-schema.ts?raw";
import usernameSchema from "../../registry/blocks/credential-login/lib/validation/username-schema.ts?raw";
import typesIndex from "../../registry/blocks/credential-login/types/index.ts?raw";

// Registry metadata with file contents
const registryItems: Record<string, object> = {
  "credential-login": {
    name: "credential-login",
    type: "registry:block",
    title: "Credential Login",
    description:
      "A credential-based login form with email/username/phone support",
    dependencies: [
      "zod",
      "react-hook-form",
      "@hookform/resolvers",
      "i18next",
      "react-i18next",
      "lucide-react",
    ],
    registryDependencies: [
      "button",
      "input",
      "label",
      "form",
      "card",
      "checkbox",
    ],
    files: [
      {
        path: "components/credential-login-form.tsx",
        type: "registry:component",
        content: credentialLoginForm,
      },
      {
        path: "lib/validation/email-schema.ts",
        type: "registry:lib",
        content: emailSchema,
      },
      {
        path: "lib/validation/username-schema.ts",
        type: "registry:lib",
        content: usernameSchema,
      },
      {
        path: "lib/validation/phone-schema.ts",
        type: "registry:lib",
        content: phoneSchema,
      },
      {
        path: "lib/validation/password-schema.ts",
        type: "registry:lib",
        content: passwordSchema,
      },
      {
        path: "lib/validation/index.ts",
        type: "registry:lib",
        content: validationIndex,
      },
      { path: "lib/utils.ts", type: "registry:lib", content: utils },
      { path: "types/index.ts", type: "registry:lib", content: typesIndex },
    ],
    categories: ["authentication", "login"],
  },
};

const JSON_EXT_REGEX = /\.json$/;

export const Route = createFileRoute("/r/$")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const itemName = params._splat?.replace(JSON_EXT_REGEX, "") ?? "";
        const item = registryItems[itemName];

        if (!item) {
          return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(item, null, 2), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
