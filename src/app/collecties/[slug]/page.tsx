import { SiteLink as Link } from "@/components/site-link";
import {notFound} from "next/navigation";
import {categories,products} from "@/data/catalog";
import {Breadcrumb} from "@/components/catalog";
import {ProductBrowser} from "@/components/product-browser";
import {ecwid,pageMetadata} from "@/lib/site";
import {EcwidStore} from "@/components/ecwid-store";
import {PhotoSpace} from "@/components/placeholder";
export function generateStaticParams(){return categories.map(c=>({slug:c.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=categories.find(c=>c.slug===slug);return pageMetadata(c?.name||"Collectie",`/collecties/${slug}/`,c?.description);}
export default async function Category({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const c=categories.find(c=>c.slug===slug);if(!c)notFound();
  return <div className="shell section-page"><Breadcrumb items={[{label:"Alle producten",href:"/collecties"},{label:c.name}]} /><header className="page-heading"><h1>{c.name}</h1></header>{ecwid.enabled ? (ecwid.categoryIds[slug] ? <EcwidStore categoryId={ecwid.categoryIds[slug]} /> : <div className="empty-collection"><p>Deze collectie wordt aangevuld.</p><Link className="button button-small" href="/winkel/">Bekijk de winkel</Link></div>) : c.status==="pending"?<div className="empty-collection"><PhotoSpace slot={`category:${slug}`} kind="category-preview" fit="contain" priority /><p>Deze collectie is in voorbereiding.</p><Link className="button button-small" href="/collecties">Bekijk de andere collecties</Link></div>:<ProductBrowser products={products.filter(p=>p.category===slug)} />}</div>;
}
