import catalog from "./catalog-data.json" with {type:"json"};
// Voorbereidingscatalogus. Bedragen in eurocenten, geen voorraad of live Ecwid-ID's.
export type Choice={value:string;label:string;price?:number};
export type ProductOption={key:string;label:string;type:"select"|"text"|"textarea"|"checkbox"|"pending";choices?:Choice[];maxLength?:number;minItems?:number;maxItems?:number;required?:boolean;help?:string;surcharge?:number;priceUnknown?:boolean;when?:{key:string;value:string|string[]}};
export type Product={slug:string;name:string;category:string;description:string;price:number|null;fromPrice?:boolean;priceByOption?:string;featured?:boolean;bestseller?:boolean;concept?:boolean;image:string|null;ecwidId:number|null;options:ProductOption[];missing:string[];notes?:string[];materials?:string[];details?:string[]};
export const categories=catalog.categories;
export const products=catalog.products as Product[];
export function formatPrice(cents:number){return new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR"}).format(cents/100);}
export function visibleOptions(product:Product,values:Record<string,string|boolean>){return product.options.filter(o=>!o.when||(Array.isArray(o.when.value)?o.when.value.includes(String(values[o.when.key])):values[o.when.key]===o.when.value));}
export function previewPrice(product:Product,values:Record<string,string|boolean>){
 if(product.price===null)return null;
 let price=product.price;
 for(const option of visibleOptions(product,values)){
  if(option.priceUnknown&&values[option.key]&&values[option.key]!=="none")return null;
  const choice=option.choices?.find(c=>c.value===values[option.key]);
  if(option.key===product.priceByOption&&choice?.price!==undefined)price=choice.price;
  else if(choice?.price!==undefined)price+=choice.price;
  if(option.type==="checkbox"&&values[option.key]===true)price+=option.surcharge||0;
 }
 return price;
}
export function maxLengthFor(product:Product,option:ProductOption,values:Record<string,string|boolean>){
 if(product.slug==="punniknaam-fotolijst"&&option.key==="name")return values.size==="small"?4:undefined;
 if((product.slug==="paracord-initial-bracelet"||product.slug==="paracord-initial-necklace")&&option.key==="initial")return (values.size??values.letterSize)==="small"?1+Number(values.extra||0):1;
 return option.maxLength;
}
