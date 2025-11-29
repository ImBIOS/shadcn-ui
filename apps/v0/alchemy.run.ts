import { config } from "@dotenvx/dotenvx";
import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";

config({ path: "./.env" });

const app = await alchemy("ImBIOS UI");

export const v0 = await TanStackStart("v0", {
  bindings: {
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "",
  },
  dev: {
    command: "pnpm run dev",
  },
});

console.log(`v0    -> ${v0.url}`);

await app.finalize();
