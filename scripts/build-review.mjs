import { spawnSync } from "node:child_process";
import { reviewEnvironment } from "./review-environment.mjs";

// Alleen de vrijgegeven productiecatalogus staat open voor indexering.
const environment=reviewEnvironment(process.env);
console.log(`Beoordelingsbuild: https://juliefleur.nl · ${environment.NEXT_PUBLIC_SITE_INDEXABLE==="true"?"indexeerbaar":"noindex"} · Ecwid ${environment.NEXT_PUBLIC_ECWID_CATALOG_PUBLISHED==="true"?"live catalogus":environment.NEXT_PUBLIC_ECWID_PREVIEW==="true"?"Preview":"uit"} · online betalen niet beschikbaar · contact via mailprogramma.`);
const result=spawnSync(process.execPath,["node_modules/next/dist/bin/next","build"],{stdio:"inherit",env:{...process.env,...environment}});
if(result.error)throw result.error;
process.exit(result.status??1);
