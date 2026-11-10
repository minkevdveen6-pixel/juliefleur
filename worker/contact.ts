import { validateContact } from "../src/lib/contact-validation.ts";

export type ContactEnv = {
  CONTACT_ENABLED?:string; RESEND_API_KEY?:string; CONTACT_FROM?:string;
  CONTACT_RATE_LIMIT_SALT?:string; UPSTASH_REDIS_REST_URL?:string; UPSTASH_REDIS_REST_TOKEN?:string;
};
const destination="info@juliefleur.nl";
const headers={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
const reply=(status:number,body:unknown,extra:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
export function contactConfigured(env:ContactEnv) {
  return env.CONTACT_ENABLED==="true" && Boolean(env.RESEND_API_KEY && env.CONTACT_FROM && !/[\r\n]/.test(env.CONTACT_FROM) && /@/.test(env.CONTACT_FROM) &&
    env.CONTACT_RATE_LIMIT_SALT && env.CONTACT_RATE_LIMIT_SALT.length>=32 && env.UPSTASH_REDIS_REST_URL && /^https:\/\/[a-z0-9-]+\.upstash\.io\/?$/i.test(env.UPSTASH_REDIS_REST_URL) && env.UPSTASH_REDIS_REST_TOKEN);
}
// Alleen HMAC-kenmerken en tijdelijke tellers in Redis. Geen namen, adressen of berichten.
const limiterScript=`
for i=1,#KEYS do
  local current=tonumber(redis.call('GET',KEYS[i]) or '0')
  if current>=tonumber(ARGV[(i-1)*2+1]) then return {0,math.max(1,redis.call('TTL',KEYS[i]))} end
end
for i=1,#KEYS do
  local n=redis.call('INCR',KEYS[i])
  if n==1 then redis.call('EXPIRE',KEYS[i],tonumber(ARGV[(i-1)*2+2])) end
end
return {1,0}`;
async function digest(key:string,value:string) {
  const bytes=new TextEncoder();
  const cryptoKey=await crypto.subtle.importKey("raw",bytes.encode(key),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",cryptoKey,bytes.encode(value)))).map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function readPayload(request:Request) {
  const limit=32*1024;
  if(Number(request.headers.get("content-length")||0)>limit) throw new RangeError();
  const reader=request.body?.getReader();if(!reader)throw new SyntaxError();
  const chunks:Uint8Array[]=[];let size=0;
  try {while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new RangeError();}chunks.push(value);}}
  finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));
}

export async function handleContact(request:Request, env:ContactEnv, fetcher:typeof fetch=fetch, now=Date.now()):Promise<Response> {
  if(request.method==="GET")return reply(200,{ready:contactConfigured(env)});
  if(request.method!=="POST")return reply(405,{message:"Deze methode wordt niet ondersteund."},{Allow:"GET, POST"});
  const origin=request.headers.get("origin");
  if(origin!==new URL(request.url).origin||request.headers.get("sec-fetch-site")==="cross-site")return reply(403,{message:"Open het formulier op de website en probeer opnieuw."});
  if(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json")return reply(415,{message:"Ongeldig berichtformaat."});
  if(!contactConfigured(env))return reply(503,{message:"Het formulier is nog niet aangesloten. Mail rechtstreeks naar info@juliefleur.nl."});
  let payload:Record<string,unknown>;
  try{payload=await readPayload(request);}catch(error){return reply(error instanceof RangeError?413:400,{message:"Het bericht kon niet worden gelezen. Controleer de invoer."});}
  const {fields,errors}=validateContact(payload);
  if(Object.keys(errors).length)return reply(422,{message:"Controleer de gemarkeerde velden.",errors});
  if(typeof payload.website!=="string"||payload.website!==""||typeof payload.startedAt!=="number"||now-payload.startedAt<2000||now-payload.startedAt>86400000||
    typeof payload.submissionId!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.submissionId))return reply(400,{message:"Je bericht is niet verstuurd. Open de contactpagina opnieuw of mail ons rechtstreeks."});
  // Cloudflare overschrijft deze header aan de rand; vertrouw nooit een vrij X-Forwarded-For.
  const ip=request.headers.get("cf-connecting-ip");
  if(!ip)return reply(503,{message:"Verzenden is tijdelijk niet mogelijk. Je tekst blijft staan. Mail ons eventueel rechtstreeks."});
  const [ipHash,emailHash]=await Promise.all([digest(env.CONTACT_RATE_LIMIT_SALT!,ip),digest(env.CONTACT_RATE_LIMIT_SALT!,fields.email.toLowerCase())]);
  try{
    const rate=await fetcher(env.UPSTASH_REDIS_REST_URL!,{method:"POST",headers:{Authorization:`Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify(["EVAL",limiterScript,"3",`jf:contact:ip:${ipHash}`,`jf:contact:email:${emailHash}`,"jf:contact:global","5","900","3","3600","60","3600"]),signal:AbortSignal.timeout(5000)});
    if(!rate.ok)throw new Error("rate unavailable");
    const result=await rate.json() as {result?:[number,number]};
    if(!Array.isArray(result.result)||result.result.length!==2)throw new Error("rate invalid");
    if(result.result[0]!==1)return reply(429,{message:"Er zijn al meerdere berichten verstuurd. Probeer het later opnieuw of mail ons rechtstreeks."},{"Retry-After":String(Math.max(1,Number(result.result[1])||900))});
  }catch{return reply(503,{message:"Verzenden is tijdelijk niet mogelijk. Je tekst blijft staan. Probeer later opnieuw."});}
  const text=`Nieuw contactbericht via Julie Fleur\n\nNaam: ${fields.name}\nE-mailadres: ${fields.email}\nOnderwerp: ${fields.subject}\n\nBericht:\n${fields.message}\n\nKenmerk: ${payload.submissionId}`;
  try{
    const result=await fetcher("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json","Idempotency-Key":`julie-fleur-contact/${payload.submissionId}`},body:JSON.stringify({from:env.CONTACT_FROM,to:[destination],reply_to:fields.email,subject:`Julie Fleur · ${fields.subject}`,text}),signal:AbortSignal.timeout(12000)});
    if(!result.ok)return reply(502,{message:"De maildienst heeft de verzending niet bevestigd. Je tekst blijft staan; probeer opnieuw of mail ons rechtstreeks.",reference:payload.submissionId});
    const body=await result.json() as {id?:unknown};
    if(typeof body.id!=="string"||!body.id)return reply(502,{message:"De verzending is niet bevestigd. Je tekst blijft staan.",reference:payload.submissionId});
    return reply(200,{ok:true,reference:payload.submissionId});
  }catch{return reply(503,{message:"De verzending kon niet worden bevestigd. Je tekst blijft staan. Bij opnieuw proberen gebruiken we hetzelfde berichtkenmerk.",reference:payload.submissionId});}
}
