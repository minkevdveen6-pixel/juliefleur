import { spawnSync } from "node:child_process";
import { reviewEnvironment } from "./review-environment.mjs";

// De catalogus kan expliciet live; indexering en betalingsmelding blijven in beoordelingsfase.
const environment=reviewEnvironment(process.env);
console.log(`Beoordelingsbuild: https://juliefleur.nl · noindex · Ecwid ${environment.NEXT_PUBLIC_ECWID_CATALOG_PUBLISHED==="true"?"live catalogus":environment.NEXT_PUBLIC_ECWID_PREVIEW==="true"?"Preview":"uit"} · online betalen niet beschikbaar · contact via mailprogramma.`);
const result=spawnSync(process.execPath,["node_modules/next/dist/bin/next","build"],{stdio:"inherit",env:{...process.env,...environment}});
if(result.error)throw result.error;
process.exit(result.status??1);
