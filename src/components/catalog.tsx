import { SiteLink as Link } from "@/components/site-link";
import { formatPrice,type Product } from "@/data/catalog";
import { PhotoSpace } from "./placeholder";
export function ProductCard({product}:{product:Product;index?:number}){
  return <Link href={`/producten/${product.slug}`} className="product-card"><PhotoSpace kind="product" slot={`product:${product.slug}`} image={product.image} alt={product.name} fit="contain" position="left center" /><h3>{product.name}</h3><p className="product-price">{product.price===null?"In voorbereiding":`${product.fromPrice?"Vanaf ":""}${formatPrice(product.price)}`}</p></Link>;
}
export function CatalogNotice(){return <p className="catalog-notice">De webshop is in voorbereiding. Bestellen en betalen zijn nog niet mogelijk.</p>;}
export function Breadcrumb({items}:{items:{label:string;href?:string}[]}){
  return <nav className="breadcrumb" aria-label="Kruimelpad"><Link href="/">Home</Link>{items.map((item,i)=><span key={i}><span className="crumb-divider" aria-hidden="true">/</span>{item.href?<Link href={item.href}>{item.label}</Link>:<span aria-current="page">{item.label}</span>}</span>)}</nav>;
}
