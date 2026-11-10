import { SiteLink as Link } from "@/components/site-link";
import {categories,products} from "@/data/catalog";
import {Breadcrumb} from "@/components/catalog";
import {ProductBrowser} from "@/components/product-browser";
import {EcwidStore} from "@/components/ecwid-store";
import {ecwid,pageMetadata} from "@/lib/site";
export const metadata=pageMetadata("Alle collecties","/collecties/");
export default function Collections(){return <div className="shell section-page"><Breadcrumb items={[{label:"Collecties"}]} /><header className="page-heading"><h1>Alle collecties</h1></header><nav className="category-tabs" aria-label="Kies een collectie">{categories.map(c=><Link href={`/collecties/${c.slug}`} key={c.slug}>{c.name}</Link>)}</nav>{ecwid.enabled ? <EcwidStore allProducts /> : <ProductBrowser products={products} />}</div>;}
