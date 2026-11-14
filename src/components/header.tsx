"use client";

import { SiteLink as Link } from "@/components/site-link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { categories } from "@/data/catalog";
import { ecwid, site } from "@/lib/site";
import { Icon } from "./icons";
import { EcwidCartIcon } from "./ecwid-cart";
import { BrandLogo } from "./brand-logo";

export function Header() {
  const menu = useRef<HTMLDialogElement>(null);
  const cart = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  useEffect(() => { menu.current?.close(); cart.current?.close(); }, [path]);
  return <>
    {!site.launched && <div className="preview-bar">Een eerste kijkje bij Julie Fleur <span>·</span> {ecwid.enabled ? "Online betalen is binnenkort beschikbaar" : "De webshop is in voorbereiding"}</div>}
    <header className="site-header">
      <div className="header-top shell">
        <button className="icon-button mobile-menu" aria-label="Menu openen" onClick={() => menu.current?.showModal()}><Icon name="menu" /></button>
        <span className="header-caption" aria-hidden="true" />
        <BrandLogo preload />
        <div className="header-actions"><Link href="/zoeken" className="icon-button" aria-label="Zoeken"><Icon name="search" /></Link>{ecwid.enabled ? <EcwidCartIcon /> : <button className="icon-button" aria-label="Winkelmandje, winkel nog niet geopend" onClick={() => cart.current?.showModal()}><Icon name="bag" /></button>}</div>
      </div>
      <nav className="desktop-nav" aria-label="Hoofdnavigatie"><Link href="/collecties" aria-current={path === "/collecties/" ? "page" : undefined}>Alle producten</Link>{ecwid.enabled && <Link href="/bestsellers/" aria-current={path === "/bestsellers/" ? "page" : undefined}>Bestsellers</Link>}{categories.map(c => <Link key={c.slug} href={`/collecties/${c.slug}`} aria-current={path.includes(c.slug) ? "page" : undefined}>{c.name}</Link>)}<span className="nav-separator" /><Link href="/over-fleur">Over Fleur</Link><Link href="/contact">Contact</Link></nav>
    </header>
    <dialog ref={menu} className="menu-dialog" aria-labelledby="menu-heading" onClick={e => { if (e.target === e.currentTarget) menu.current?.close(); }}>
      <div className="dialog-top"><span id="menu-heading" className="eyebrow">Ontdek Julie Fleur</span><button className="icon-button" aria-label="Menu sluiten" onClick={() => menu.current?.close()}><Icon name="close" /></button></div>
      <nav aria-label="Mobiele navigatie"><Link href="/collecties" onClick={() => menu.current?.close()}>Alle producten</Link>{ecwid.enabled && <Link href="/bestsellers/" onClick={() => menu.current?.close()}>Bestsellers</Link>}{categories.map(c => <Link key={c.slug} href={`/collecties/${c.slug}`} onClick={() => menu.current?.close()}>{c.name}</Link>)}<Link href="/over-fleur" onClick={() => menu.current?.close()}>Over Fleur</Link><Link href="/contact" onClick={() => menu.current?.close()}>Contact</Link><Link href="/veelgestelde-vragen" onClick={() => menu.current?.close()}>Veelgestelde vragen</Link></nav>
    </dialog>
    <dialog ref={cart} className="cart-dialog" aria-labelledby="cart-heading"><div className="dialog-top"><span>Winkelmandje</span><button className="icon-button" aria-label="Sluiten" onClick={() => cart.current?.close()}><Icon name="close" /></button></div><h2 id="cart-heading">Webshop in voorbereiding</h2><p>Bestellen en betalen zijn nog niet mogelijk.</p><Link href="/collecties" className="button" onClick={() => cart.current?.close()}>Bekijk de collectie</Link></dialog>
  </>;
}
