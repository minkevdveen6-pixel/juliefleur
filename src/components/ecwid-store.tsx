"use client";
import { useEffect, useRef, useState } from "react";
import { ecwid } from "@/lib/site";
import { canShowEcwidPage } from "@/lib/ecwid-integration";
import { useEcwid } from "./ecwid-provider";
import { observeOptionHelp } from "./ecwid-option-help";
import { SiteLink } from "./site-link";
import styles from "./ecwid-store.module.css";

export function EcwidStore({ categoryId, featured = false, main = false, allProducts = false }: { categoryId?: number; featured?: boolean; main?: boolean; allProducts?: boolean }) {
  const { ready, error: apiError, page, quantity, containsSamples } = useEcwid();
  const [timedOut, setTimedOut] = useState(false);
  const nativeStore = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page.type === "PRODUCT" && nativeStore.current) {
      return observeOptionHelp(nativeStore.current, page.productId);
    }
  }, [page.type, page.productId]);
  useEffect(() => {
    if (!ecwid.enabled || page.type !== "LOADING") return;
    const timeout = setTimeout(() => setTimedOut(true), 30000);
    return () => clearTimeout(timeout);
  }, [page.type]);
  const error = apiError || (timedOut && page.type === "LOADING");
  if (!ecwid.enabled) return null;
  const cart = page.type === "CART";
  const checkout = cart || page.type.startsWith("CHECKOUT_");
  const emptyCart = cart && quantity === 0;
  const cartSamples = containsSamples && (cart || page.type.startsWith("CHECKOUT_"));
  const wrongCategory = !!categoryId && (page.type !== "CATEGORY" || page.categoryId !== categoryId);
  const showNative = !wrongCategory && ready && !error && !emptyCart && !cartSamples &&
    canShowEcwidPage(page, Object.values(ecwid.categoryIds), ecwid.catalogReady);
  const loaded = ready && page.type !== "LOADING";
  return <div className={`${styles.store} ${main ? styles.mainStore : ""}`} data-ecwid-status={error ? "error" : loaded ? "ready" : "loading"} data-ecwid-api={ready ? "ready" : "loading"} data-ecwid-page={page.type} data-ecwid-store={ecwid.storeId}>
    {main && checkout && !ecwid.paymentsAvailable && <aside className={styles.paymentNotice} aria-label="Online betalen"><strong>Online betalen is nog niet beschikbaar.</strong><p>Je kunt je winkelmandje alvast samenstellen. De betaalmogelijkheid volgt binnenkort.</p></aside>}
    {main && !showNative && <h1>{cart || !loaded ? "Winkelmandje" : "Alle producten"}</h1>}
    {error ? <div className={styles.error} role="alert"><h2>De winkel is even niet bereikbaar.</h2><p>Probeer het opnieuw of neem contact op met Fleur.</p><button className="button button-small" onClick={() => window.location.reload()}>Probeer opnieuw</button></div>
      : emptyCart ? <div className={styles.emptyCart}><p>Je winkelmandje is nog leeg.</p><SiteLink href="/collecties/" className="button button-small">Bekijk alle producten</SiteLink></div>
      : cartSamples ? <div className={styles.empty}><p>Een artikel in dit winkelmandje is nog niet beschikbaar.</p><SiteLink href="/collecties/" className="text-link">Bekijk alle producten</SiteLink></div>
      : !loaded ? <p className={styles.status} role="status">De winkel wordt geladen…</p>
      : !showNative ? <div className={styles.empty}><p>De collectie wordt binnenkort toegevoegd.</p>{!featured && <SiteLink className="text-link" href="/collecties/">Bekijk alle producten</SiteLink>}</div> : null}
    <div className={showNative ? undefined : styles.unavailable} inert={!showNative} aria-hidden={!showNative}>
      <div ref={nativeStore} id={`my-store-${ecwid.storeId}`} data-julie-ecwid-browser="true" data-category-id={categoryId} data-all-products={allProducts ? "true" : undefined} data-featured={featured ? "true" : undefined} />
    </div>
    {main && loaded && !error && <nav className={styles.serviceLinks} aria-label="Je bestelling"><SiteLink href="/winkel/#!/~/account">Mijn account &amp; bestellingen</SiteLink><SiteLink href="/contact/">Hulp nodig?</SiteLink></nav>}
    <noscript>Voor de winkel is JavaScript nodig. Je kunt Fleur bereiken via de contactpagina.</noscript>
  </div>;
}
