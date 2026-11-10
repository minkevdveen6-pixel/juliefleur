import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const source=await readFile("public/images/brand/julie-fleur-favicon-original.png");
const sizes=[16,32,48];
const frames=await Promise.all(sizes.map(size=>sharp(source).resize(size,size).png().toBuffer()));
const header=Buffer.alloc(6+16*frames.length);
header.writeUInt16LE(1,2);header.writeUInt16LE(frames.length,4);
let offset=header.length;
frames.forEach((frame,i)=>{
  const position=6+16*i;
  header[position]=sizes[i];header[position+1]=sizes[i];
  header.writeUInt16LE(1,position+4);header.writeUInt16LE(32,position+6);
  header.writeUInt32LE(frame.length,position+8);header.writeUInt32LE(offset,position+12);
  offset+=frame.length;
});
await writeFile("public/favicon.ico",Buffer.concat([header,...frames]));
await writeFile("public/favicon-32x32.png",frames[1]);
await sharp(source).resize(192,192).png().toFile("public/favicon.png");
await sharp(source).resize(180,180).png().toFile("public/apple-touch-icon.png");
const folder="artifacts/julie-fleur-favicon";
await mkdir(folder,{recursive:true});
await writeFile(`${folder}/julie-fleur-favicon-original.png`,source);
await sharp(source).resize(192,192).png().toFile(`${folder}/preview.png`);
console.log("Aangeleverde JF-favicon verwerkt: ICO (16/32/48 px), PNG en Apple-touch-icon.");
