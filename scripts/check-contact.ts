import assert from "node:assert/strict";
import { handleContact, type ContactEnv } from "../worker/contact.ts";
import { validateContact } from "../src/lib/contact-validation.ts";

// Alleen testwaarden en gesimuleerde HTTP-antwoorden. Geen externe verzending.
const now=Date.now();
const origin="https://julie-fleur.example";
const env:ContactEnv={CONTACT_ENABLED:"true",RESEND_API_KEY:"test-only-not-a-real-key",CONTACT_FROM:"Julie Fleur <test@julie-fleur.example>",CONTACT_RATE_LIMIT_SALT:"test-only-salt-with-at-least-32-characters",UPSTASH_REDIS_REST_URL:"https://test.upstash.io",UPSTASH_REDIS_REST_TOKEN:"test-only-not-a-real-token"};
const payload={name:"Testpersoon",email:"bezoeker@example.org",subject:"Vraag over personaliseren",message:"Dit is een testbericht, zonder echte verzending.",website:"",startedAt:now-5000,submissionId:"6ac3eb04-f686-4f84-a9a5-1f7e7b2f3cec"};
const request=(body:unknown=payload,headers:Record<string,string>={})=>new Request(`${origin}/api/contact`,{method:"POST",headers:{origin,"Content-Type":"application/json","cf-connecting-ip":"192.0.2.5",...headers},body:JSON.stringify(body)});
const calls:{url:string;body:Record<string,unknown>|unknown[];headers:Headers}[]=[];
const mock=(mode="success"):typeof fetch=>async(input,init)=>{
  const url=String(input);const body=JSON.parse(String(init?.body));calls.push({url,body,headers:new Headers(init?.headers)});
  if(url.includes("upstash")){
    if(mode==="rate-offline")throw new Error("simulated outage");
    return Response.json({result:mode==="limited"?[0,600]:[1,0]});
  }
  if(mode==="mail-timeout")throw new Error("simulated timeout");
  if(mode==="mail-failure")return Response.json({error:"simulated"},{status:422});
  if(mode==="no-id")return Response.json({});
  return Response.json({id:"test-message-id"});
};
let count=0;
async function expectStatus(req:Request,status:number,configuration=env,mode="success"){
  calls.length=0;const response=await handleContact(req,configuration,mock(mode),now);
  assert.equal(response.status,status);count++;return response;
}
const disabled=await handleContact(new Request(`${origin}/api/contact`),{});
assert.deepEqual(await disabled.json(),{ready:false});count++;
assert.deepEqual(await (await handleContact(new Request(`${origin}/api/contact`),env)).json(),{ready:true});count++;
await expectStatus(request(),503,{});assert.equal(calls.length,0);
await expectStatus(request(payload,{origin:"https://andere.example"}),403);assert.equal(calls.length,0);
await expectStatus(request(payload,{"Content-Type":"text/plain"}),415);
await expectStatus(request(payload,{"Content-Type":"application/json-invalid"}),415);
await expectStatus(request({...payload,email:"naam@example.org\r\nBcc: spam@example.org"}),422);assert.equal(calls.length,0);
await expectStatus(request({...payload,subject:"Onderwerp\nTweede regel"}),422);
await expectStatus(request({...payload,message:"kort"}),422);
await expectStatus(request({...payload,website:"https://bot.example"}),400);
await expectStatus(request({...payload,startedAt:now-100}),400);
await expectStatus(request({...payload,submissionId:"ongeldig"}),400);
await expectStatus(request({...payload,message:"a".repeat(40000)}),413);
await expectStatus(request(null),422);
await expectStatus(request(payload,{"cf-connecting-ip":""}),503);
let response=await expectStatus(request(),429,env,"limited");assert.equal(response.headers.get("Retry-After"),"600");assert.equal(calls.length,1);
await expectStatus(request(),503,env,"rate-offline");assert.equal(calls.length,1);
await expectStatus(request(),502,env,"mail-failure");
await expectStatus(request(),503,env,"mail-timeout");
await expectStatus(request(),502,env,"no-id");
response=await expectStatus(request({...payload,to:"ongewenst@example.org"}),200);
assert.equal((await response.json()).ok,true);
const emailCall=calls[1];const body=emailCall.body as Record<string,unknown>;
assert.deepEqual(body.to,["info@juliefleur.nl"]);
assert.equal(body.reply_to,payload.email);
assert.equal(body.from,env.CONTACT_FROM);
assert.equal(body.html,undefined);
assert.match(String(body.text),/Naam: Testpersoon/);
assert.equal(emailCall.headers.get("Idempotency-Key"),`julie-fleur-contact/${payload.submissionId}`);
const rateBody=JSON.stringify(calls[0].body);
assert(!rateBody.includes(payload.email)&&!rateBody.includes("192.0.2.5"),"Rate limiter bevat geen rauw e-mailadres of IP-adres");
assert.equal(response.headers.get("Cache-Control"),"no-store");
assert(Object.keys(validateContact({}).errors).length===4);
assert(Object.keys(validateContact(payload).errors).length===0);
await expectStatus(new Request(`${origin}/api/contact`,{method:"PUT"}),405);
console.log(`Contactcontrole geslaagd: ${count} scenario’s, vaste ontvanger, Reply-To, validatie, begrenzing, spam/rate-fouten en idempotentie. Externe diensten zijn gesimuleerd; geen echte e-mail verzonden.`);
