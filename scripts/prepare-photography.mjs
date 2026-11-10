import sharp from "sharp";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const plan=JSON.parse(readFileSync("src/data/photography.json","utf8"));
const directory=path.resolve(process.argv[2]||"assets/originals");
const files=existsSync(directory)?readdirSync(directory):[];
const generated={};const missing=[];
mkdirSync("public/images/products",{recursive:true});
for(const original of plan.expectedOriginals){
  const matched=files.find(file=>file.toLowerCase()===original.toLowerCase());
  if(!matched){missing.push(original);continue;}
  const input=path.join(directory,matched);const metadata=await sharp(input).metadata();
  const rotated=[5,6,7,8].includes(metadata.orientation);
  const width=rotated?metadata.height:metadata.width;
  if(!width)throw new Error(`Afmetingen onbekend: ${original}`);
  const widths=[...new Set([480,960,1440].map(size=>Math.min(size,width)))];
  const variants=[];let last;
  for(const size of widths){
    const output=`/images/products/${path.parse(original).name.toLowerCase()}-${size}.webp`;
    const info=await sharp(input).rotate().resize({width:size,withoutEnlargement:true}).toColourspace("srgb").webp({quality:85,effort:5}).toFile(`public${output}`);
    variants.push({src:output,width:info.width});last={src:output,width:info.width,height:info.height};
  }
  generated[original]={...last,variants};
}
writeFileSync("src/data/photography-generated.json",JSON.stringify(generated,null,2)+"\n");
console.log(`${Object.keys(generated).length} originele foto's voorbereid. ${missing.length} ontbreken.`);
if(missing.length)console.log(`Niet gevonden in ${directory}: ${missing.join(", ")}`);
console.log("Koppel uitsluitend na visuele controle via photography.json: slots/products én approvedImages met een feitelijke alt-tekst. Er worden geen categorieën geraden.");
