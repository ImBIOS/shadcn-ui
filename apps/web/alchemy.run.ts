import { config } from "@dotenvx/dotenvx";
import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";

config({ path: "./.env" });

const app = await alchemy("better-auth-ui-web");

export const web = await TanStackStart("web", {
  bindings: {
    CORS_ORIGIN: process.env.CORS_ORIGIN || "",
  },
  dev: {
    command: "pnpm run dev",
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
