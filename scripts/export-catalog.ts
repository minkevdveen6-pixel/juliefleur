import { mkdirSync,writeFileSync } from "node:fs";
import { products,categories } from "../src/data/catalog.ts";
mkdirSync("docs",{recursive:true});
writeFileSync("docs/ASSORTIMENT.json",JSON.stringify({status:"voorbereiding, geen live catalogus",source:"Volledige briefing Fleur, aangeleverd 03-11-2026",currency:"EUR",priceUnit:"eurocent",categories,products},null,2)+"\n");
console.log("docs/ASSORTIMENT.json bijgewerkt vanuit src/data/catalog.ts");
