import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const config=JSON.parse(readFileSync("vercel.json","utf8"));
assert.equal(config.outputDirectory,"out");assert.equal(config.buildCommand,"npm run build");assert.equal(config.framework,null);
assert(config.headers.some((rule:{headers:{key:string;value:string}[]})=>rule.headers.some(h=>h.key==="X-Robots-Tag"&&h.value.includes("noindex"))));
assert.equal(config.git.deploymentEnabled.main,true);assert.equal(config.git.deploymentEnabled["codex/*"],true);assert.equal(config.git.deploymentEnabled["*"],false);
console.log("Beoordelingscontrole geslaagd: Vercel-export en publicatieconfiguratie.");
