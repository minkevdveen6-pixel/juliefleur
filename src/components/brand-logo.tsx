import Image from "next/image";
import { SiteLink as Link } from "@/components/site-link";
import { site } from "@/lib/site";

export function BrandLogo({ className = "", preload = false }: { className?: string; preload?: boolean }) {
  if (!site.logo) return <Link className="brand-placeholder" href="/" aria-label="Julie Fleur, naar de homepage"><span>Julie Fleur</span><small>ORIGINEEL LOGO VOLGT</small></Link>;
  return <Link className={`brand-logo ${className}`} href="/" aria-label="Julie Fleur, naar de homepage">
    <span className="brand-image"><Image src={site.logo} width={1320} height={1597} alt="Julie Fleur" preload={preload} /></span>
  </Link>;
}
