import { build } from "esbuild";
import { existsSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

// Next.js blijft de bestaande frontend genereren. Alleen /api/* heeft een server nodig.
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
cpSync("out", "dist/client", { recursive: true });
if(existsSync(".openai/hosting.json"))cpSync(".openai/hosting.json", "dist/.openai/hosting.json");
await build({ entryPoints: ["worker/index.ts"], outfile: "dist/server/index.js", bundle: true, format: "esm", platform: "browser", target: "es2022", minify: true });
const config=JSON.parse(readFileSync("wrangler.json", "utf8"));
writeFileSync("dist/server/wrangler.json", JSON.stringify({ ...config, $schema: undefined, main: "./index.js", assets: { ...config.assets, directory: "../client" } }, null, 2)+"\n");
console.log("Next.js-export en server-side contactendpoint verpakt in dist/.");
