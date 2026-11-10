import assert from "node:assert/strict";
import { categories, products, previewPrice, visibleOptions, maxLengthFor } from "../src/data/catalog.ts";

const product=(slug:string)=>{const p=products.find(p=>p.slug===slug);assert(p,slug);return p;};
assert.equal(new Set(products.map(p=>p.slug)).size,products.length,"Productslugs zijn uniek");
for(const p of products){
  assert(categories.some(c=>c.slug===p.category),`${p.slug}: bestaande categorie`);
  assert(p.ecwidId===null && p.image===null,`${p.slug}: geen verzonnen ID of afbeelding`);
  assert(p.price===null || (Number.isInteger(p.price)&&p.price>0),`${p.slug}: prijs in centen`);
  assert.equal(new Set(p.options.map(o=>o.key)).size,p.options.length);
}
const bag=product("persoonlijke-bagcharm");
assert.equal(previewPrice(bag,{rope:"single"}),1750);
assert.equal(previewPrice(bag,{rope:"double"}),1950);
assert(!visibleOptions(bag,{rope:"single"}).some(o=>o.key==="text2"));
assert(visibleOptions(bag,{rope:"double"}).some(o=>o.key==="text2"));
assert.equal(bag.options.find(o=>o.key==="text1")?.maxLength,7);
const poppy=product("poppy-necklace");
for(let n=1;n<=9;n++)assert.equal(previewPrice(poppy,{letters:String(n)}),2195+(n-1)*300);
assert.equal(previewPrice(poppy,{letters:"9",birthstone:"1-gold",heart:"gold"}),5485);
assert.equal(previewPrice(poppy,{letters:"1",birthstone:"none",heart:"none"}),2195);
const loose=product("losse-punniknaam");
for(const [value,expected] of [["1-4",1500],["5",1600],["6",1700],["7",1800],["8",1900]] as const)assert.equal(previewPrice(loose,{letters:value}),expected);
const ring=product("punniknaam-in-ring");
assert.equal(previewPrice(ring,{finish:"tassels"}),3250);
assert.equal(previewPrice(ring,{finish:"flowers3"}),3495);
assert.equal(previewPrice(ring,{finish:"flowers5"}),3995);
const frame=product("punniknaam-fotolijst");
assert.equal(maxLengthFor(frame,frame.options.find(o=>o.key==="name")!,{size:"small"}),4);
assert.equal(maxLengthFor(frame,frame.options.find(o=>o.key==="name")!,{size:"large"}),undefined);
assert.equal(previewPrice(frame,{size:"small"}),2250);
assert.equal(previewPrice(frame,{size:"large"}),2750);
assert.equal(previewPrice(product("geboortekaartjeshouder"),{}),null);
assert(!products.some(p=>p.bestseller),"Geen fictieve bestsellers");
assert(!products.flatMap(p=>p.options).some(o=>/rush|spoed/.test(o.key)),"Geen afdwingbare spoedoptie");
for(const slug of ["paracord-initial-bracelet","paracord-initial-necklace"]){
 const p=product(slug);const key=slug.endsWith("necklace")?"letterSize":"size";
 const base=slug.endsWith("necklace")?1995:1395;
 for(const [extra,cost] of [["0",0],["1",350],["2",700],["3",1150]] as const)assert.equal(previewPrice(p,{[key]:"small",extra}),base+cost);
 assert(!visibleOptions(p,{[key]:"large"}).some(o=>o.key==="extra"));
 assert.equal(previewPrice(p,{[key]:"large",extra:"3"}),slug.endsWith("necklace")?1795:1595,"Verborgen extra letters worden niet berekend");
 assert.equal(maxLengthFor(p,p.options.find(o=>o.key==="initial")!,{[key]:"small",extra:"3"}),4);
}
assert(!visibleOptions(ring,{finish:"tassels"}).some(o=>o.key==="base"));
assert(visibleOptions(ring,{finish:"flowers3"}).some(o=>o.key==="base"));
assert.equal(previewPrice(ring,{finish:"flowers3",base:"wood"}),null,"Onbekende prijs van voetje niet als gratis behandelen");
assert.equal(previewPrice(ring,{finish:"tassels",base:"wood"}),3250,"Verborgen voetje telt niet mee");
assert.equal(poppy.options.find(o=>o.key==="birthstone")?.choices?.length,25,"Geen plus twaalf maanden in twee metaalkleuren");
for(const c of poppy.options.find(o=>o.key==="birthstone")!.choices!.filter(c=>c.value!=="none"))assert.equal(previewPrice(poppy,{letters:"1",birthstone:c.value,heart:"none"}),2690);
for(const slug of ["chunky-initial-bracelet","mermaid-initial-bracelet"]){
 const choices=product(slug).options.find(o=>o.key==="initial")!.choices!;
 assert.equal(choices.length,25);assert(!choices.some(c=>c.value==="F"));
}
assert.equal(bag.options.find(o=>o.key==="letterColors")?.minItems,3);
assert.equal(bag.options.find(o=>o.key==="excludedColors")?.maxItems,2);
assert.equal(ring.options.find(o=>o.key==="accentColors")?.maxItems,3);
assert(products.every(p=>p.concept),"Geen definitieve vijf lanceringsproducten geraden");
console.log(`Cataloguscontrole geslaagd: ${products.length} producten, prijzen, toeslagen, voorwaarden en ontbrekende data.`);
