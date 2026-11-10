import { execFileSync } from "node:child_process";

const git=(...args)=>execFileSync("git",args,{maxBuffer:32*1024*1024});
const history=process.argv.includes("--history");
const refs=process.argv.filter(arg=>arg!=="--history").slice(2);
const commits=history ? git("rev-list",...(refs.length?refs:["HEAD"])).toString().trim().split("\n") : [null];
const seen=new Set();
const issues=[];
const forbidden=/(^|\/)(?:\.env[^/]*|\.dev\.vars[^/]*|\.npmrc|\.netrc|credentials[^/]*\.json|[^/]+\.(?:pem|key|p12|pfx))$|^(?:\.openai|\.vercel|node_modules|assets\/originals)\//i;
const rules=[
  ["GitHub-token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["AWS-toegangssleutel", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["API-secret", /\b(?:sk_(?:live|test)_[A-Za-z0-9]{16,}|sk-proj-[A-Za-z0-9_-]{30,}|re_[A-Za-z0-9]{24,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/],
  ["Privésleutel", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/],
  ["Ingevuld geheim", /(?:api[_-]?key|access[_-]?token|auth[_-]?token|refresh[_-]?token|client[_-]?secret|password)\s*[=:]\s*["']([A-Za-z0-9_+\/-]{24,})["']/i],
];
for(const commit of commits){
  const entries=commit ? git("ls-tree","-r","-z",commit).toString().split("\0") : git("ls-files","--stage","-z").toString().split("\0");
  for(const entry of entries.filter(Boolean)){
    const [metadata,path]=entry.split("\t");
    const fields=metadata.split(" ");
    const sha=commit?fields[2]:fields[1];
    const key=sha+":"+path;
    if(seen.has(key))continue;
    seen.add(key);
    if(forbidden.test(path)){issues.push({path,rule:"Uitgesloten bestand"});continue;}
    const data=git("cat-file","blob",sha);
    if(data.includes(0))continue;
    const content=data.toString("utf8");
    for(const [rule,pattern] of rules){
      const matches=content.matchAll(new RegExp(pattern.source,pattern.flags+"g"));
      for(const match of matches){
        // Uitsluitend de bestaande, expliciet fictieve contacttest mag door.
        if(rule==="Ingevuld geheim"&&path==="scripts/check-contact.ts"&&["test-only-not-a-real-token","test-only-not-a-real-key"].includes(match[1]))continue;
        issues.push({path,rule});
      }
    }
  }
}
if(issues.length){
  console.error("Publicatie geblokkeerd. Controleer deze bestanden (waarden worden niet getoond):");
  for(const issue of issues)console.error(`- ${issue.path}: ${issue.rule}`);
  process.exit(1);
}
console.log(`Publicatiecontrole geslaagd: ${seen.size} bestandsversies gecontroleerd${history?" in de te publiceren historie":" in de Git-index"}.`);
