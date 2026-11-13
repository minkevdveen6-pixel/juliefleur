import { products } from "@/data/catalog";
import { ProductBrowser } from "@/components/product-browser";
import { EcwidStore } from "@/components/ecwid-store";
import { ecwid, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Alle producten", "/collecties/");

export default function Collections() {
  return <div className="shell section-page">
    <header className="page-heading"><h1>Alle producten</h1></header>
    {ecwid.enabled ? <EcwidStore allProducts /> : <ProductBrowser products={products} />}
  </div>;
}
