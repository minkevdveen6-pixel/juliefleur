import { EcwidStore } from "@/components/ecwid-store";
import { SiteLink } from "@/components/site-link";
import { ecwid, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("Bestsellers", "/bestsellers/");

export default function Bestsellers() {
  return <div className="shell section-page">
    <header className="page-heading"><h1>Bestsellers</h1></header>
    {ecwid.enabled && ecwid.categoryIds.bestsellers
      ? <EcwidStore categoryId={ecwid.categoryIds.bestsellers} />
      : <div className="empty-collection">
          <p>De selectie volgt binnenkort.</p>
          <SiteLink href="/collecties/" className="text-link">Bekijk alle producten</SiteLink>
        </div>}
  </div>;
}
