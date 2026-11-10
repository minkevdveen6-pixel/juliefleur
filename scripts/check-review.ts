import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import contact from "../api/contact.ts";

// Zelfs volledig ingestelde SMTP-waarden activeren productie niet zonder ontvangsttest.
const checkEnvironment={CONTACT_ENABLED:"true",CONTACT_SMTP_HOST:"mail.juliefleur.nl",CONTACT_SMTP_PORT:"465",CONTACT_SMTP_USER:"info@juliefleur.nl",CONTACT_SMTP_PASSWORD:"mock-only",CONTACT_DELIVERY_VERIFIED:"false",VERCEL:"1",VERCEL_ENV:"production"};
const old=Object.fromEntries(Object.keys(checkEnvironment).map(key=>[key,process.env[key]]));
Object.assign(process.env,checkEnvironment);
try {
  const get=await contact.fetch(new Request("https://juliefleur.nl/api/contact"));
  assert.equal(get.status,200);assert.deepEqual(await get.json(),{ready:false});
  const post=await contact.fetch(new Request("https://juliefleur.nl/api/contact",{method:"POST",headers:{Origin:"https://juliefleur.nl","Content-Type":"application/json"},body:"{}"}));
  assert.equal(post.status,503);assert.notEqual((await post.json()).ok,true);
  const cross=await contact.fetch(new Request("https://juliefleur.nl/api/contact",{method:"POST",headers:{Origin:"https://ander.example","Content-Type":"application/json"},body:"{}"}));
  assert.equal(cross.status,403);
  assert.equal((await contact.fetch(new Request("https://juliefleur.nl/api/contact",{method:"PUT"}))).status,405);
} finally {for(const [key,value] of Object.entries(old)){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
const config=JSON.parse(readFileSync("vercel.json","utf8"));
assert.equal(config.outputDirectory,"out");assert.equal(config.buildCommand,"npm run build");assert.equal(config.framework,null);
assert(config.headers.some((rule:{headers:{key:string;value:string}[]})=>rule.headers.some(h=>h.key==="X-Robots-Tag"&&h.value.includes("noindex"))));
assert.equal(config.git.deploymentEnabled.main,false);assert.equal(config.git.deploymentEnabled["codex/*"],true);assert.equal(config.git.deploymentEnabled["*"],false);
console.log("Beoordelingscontrole geslaagd: contact blijft uit bij verkeerde runtimevlag; GET/POST/herkomst/methode en Vercel-configuratie gecontroleerd.");
