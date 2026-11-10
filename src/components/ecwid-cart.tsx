"use client";
import { useEcwid } from "./ecwid-provider";
import { SiteLink } from "./site-link";
import { Icon } from "./icons";
import styles from "./ecwid-store.module.css";
export function EcwidCartIcon() {
  const { quantity } = useEcwid();
  const count = quantity ?? 0;
  return <div className={styles.headerCart} data-cart-quantity={quantity ?? "loading"}>
    <SiteLink className="icon-button" href="/winkel/#!/~/cart" aria-label={`Winkelmandje${count ? `, ${count} ${count === 1 ? "artikel" : "artikelen"}` : ""}`}><Icon name="bag" />{count > 0 && <span className={styles.counter} aria-hidden="true">{count}</span>}</SiteLink>
    {/* Officiële API-initialisatie op pagina's zonder productbrowser; geen tweede zichtbare winkelwagen. */}
    <div hidden inert aria-hidden="true"><div className="ec-cart-widget" data-fixed="false" data-show-buy-animation="false" /></div>
  </div>;
}
