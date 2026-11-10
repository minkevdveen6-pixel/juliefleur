// Besloten, read-only hostcontrole. Site-token uitsluitend via verborgen stdin.
import { execFileSync } from "node:child_process";
import readline from "node:readline";
import assert from "node:assert/strict";

if(process.stdin.isTTY)execFileSync("stty",["-echo"],{stdio:[process.stdin,"ignore","ignore"]});
process.stdout.write("Ready for private verification JSON on stdin (input is hidden).\n");
const input=readline.createInterface({input:process.stdin,terminal:false});
const observed={};
try{
  const line=await new Promise(resolve=>input.once("line",resolve));
  input.close();
  const {url,token}=JSON.parse(line);
  const origin=new URL(url).origin;
  assert.equal(new URL(origin).hostname,"julie-fleur-boutique.minkevanderveen.chatgpt.site");
  const headers={"OAI-Sites-Authorization":`Bearer ${token}`};
  const homepage=await fetch(`${origin}/`,{headers,redirect:"error"});
  observed.homepage=homepage.status;
  assert.equal(homepage.status,200);assert((await homepage.text()).includes("Met liefde"));
  const contact=await fetch(`${origin}/contact/`,{headers,redirect:"error"});
  observed.contact=contact.status;
  assert.equal(contact.status,200);assert((await contact.text()).includes("Heb je"));
  const status=await fetch(`${origin}/api/contact`,{headers,redirect:"error"});
  observed.contactStatus=status.status;
  assert.equal(status.status,200);assert.deepEqual(await status.json(),{ready:false});
  const blocked=await fetch(`${origin}/api/contact`,{method:"POST",headers:{...headers,Origin:origin,"Content-Type":"application/json"},body:"{}",redirect:"error"});
  observed.blockedPost=blocked.status;
  assert.equal(blocked.status,503);
  const logo=await fetch(`${origin}/images/brand/julie-fleur-original.png`,{headers,redirect:"error"});
  observed.logo=logo.status;
  assert.equal(logo.status,200);assert(logo.headers.get("content-type")?.includes("image/"));
  console.log(JSON.stringify({homepage:200,contact:200,contactStatus:200,ready:false,unconfiguredPost:503,logo:200,noEmailSent:true}));
}catch{console.error(JSON.stringify({ok:false,checks:observed,message:"Besloten hostcontrole niet volledig geslaagd; geen tokens of response-inhoud gelogd."}));process.exitCode=1;}
finally{if(process.stdin.isTTY)execFileSync("stty",["echo"],{stdio:[process.stdin,"ignore","ignore"]});}
