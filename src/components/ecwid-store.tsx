"use client";
import { useEffect, useRef, useState } from "react";
import { ecwid } from "@/lib/site";
import { canShowEcwidPage } from "@/lib/ecwid-integration";
import { useEcwid } from "./ecwid-provider";
import { observeCheckoutSummary } from "./ecwid-checkout-summary";
import { observeProductGallery } from "./ecwid-gallery";
import { observeOptionHelp } from "./ecwid-option-help";
import { SiteLink } from "./site-link";
import styles from "./ecwid-store.module.css";

export function EcwidStore({ categoryId, main = false, allProducts = false }: { categoryId?: number; main?: boolean; allProducts?: boolean }) {
  const { ready, error: apiError, page, quantity, containsSamples } = useEcwid();
  const [timedOut, setTimedOut] = useState(false);
  const [emptyCollection, setEmptyCollection] = useState(false);
  const nativeStore = useRef<HTMLDivElement>(null);
  const [summaryTotal, setSummaryTotal] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const checkoutStep = page.type.startsWith("CHECKOUT_");
  useEffect(() => {
    const store = nativeStore.current;
    if (!checkoutStep || !store) return;
    return observeCheckoutSummary(store, setSummaryTotal);
  }, [checkoutStep]);

  useEffect(() => {
    if (page.type === "PRODUCT" && nativeStore.current) {
      const restoreHelp = observeOptionHelp(nativeStore.current, page.productId);
      const restoreGallery = observeProductGallery(nativeStore.current);
      return () => { restoreGallery(); restoreHelp(); };
    }
  }, [page.type, page.productId]);
  useEffect(() => {
    if (!ecwid.enabled || page.type !== "LOADING") return;
    const timeout = setTimeout(() => setTimedOut(true), 30000);
    return () => clearTimeout(timeout);
  }, [page.type]);
  useEffect(() => {
    const store = nativeStore.current;
    if (!ready || page.type !== "CATEGORY" || !store) return;
    const refresh = () => setEmptyCollection(!store.querySelector(".grid-product, .grid-product__image[data-product-id]"));
    const observer = new MutationObserver(refresh);
    observer.observe(store, { childList: true, subtree: true });
    refresh();
    return () => observer.disconnect();
  }, [ready, page.type, page.categoryId]);
  const error = apiError || (timedOut && page.type === "LOADING");
  if (!ecwid.enabled) return null;
  const cart = page.type === "CART";
  const checkout = cart || page.type.startsWith("CHECKOUT_");
  const emptyCart = cart && quantity === 0;
  const cartSamples = containsSamples && (cart || page.type.startsWith("CHECKOUT_"));
  const wrongCategory = !!categoryId && (page.type !== "CATEGORY" || page.categoryId !== categoryId);
  const showNative = !wrongCategory && ready && !error && !emptyCart && !cartSamples &&
    canShowEcwidPage(page, Object.values(ecwid.categoryIds), ecwid.catalogReady);
  const progressSteps = ["Contact", "Verzending", "Betaling", "Bevestiging"];
  const progress = page.type === "CHECKOUT_PAYMENT_DETAILS" ? 2
    : ["CHECKOUT_ADDRESS", "CHECKOUT_ADDRESS_BOOK", "CHECKOUT_DELIVERY"].includes(page.type) ? 1
    : page.type === "ORDER_CONFIRMATION" ? 3 : -1;
  const loaded = ready && page.type !== "LOADING";
  return <div className={`${styles.store} ${main ? styles.mainStore : ""}`} data-ecwid-status={error ? "error" : loaded ? "ready" : "loading"} data-ecwid-api={ready ? "ready" : "loading"} data-ecwid-page={page.type} data-ecwid-store={ecwid.storeId}>
    {main && !showNative && <h1>{cart || !loaded ? "Winkelmandje" : "Alle producten"}</h1>}
    {error ? <div className={styles.error} role="alert"><h2>De winkel is even niet bereikbaar.</h2><p>Probeer het opnieuw of neem contact op met Fleur.</p><button className="button button-small" onClick={() => window.location.reload()}>Probeer opnieuw</button></div>
      : emptyCart ? <div className={styles.emptyCart}><p>Je winkelmandje is nog leeg.</p><SiteLink href="/collecties/" className="button button-small">Bekijk alle producten</SiteLink></div>
      : cartSamples ? <div className={styles.empty}><p>Een artikel in dit winkelmandje is nog niet beschikbaar.</p><SiteLink href="/collecties/" className="text-link">Bekijk alle producten</SiteLink></div>
      : !loaded ? <p className={styles.status} role="status">De winkel wordt geladen…</p>
      : !showNative ? <div className={styles.empty}><p>Er zijn hier geen producten beschikbaar.</p><SiteLink className="text-link" href="/collecties/">Bekijk alle producten</SiteLink></div> : null}
    {showNative && page.type === "CATEGORY" && emptyCollection && <p className={styles.empty} role="status">Er zijn op dit moment geen producten beschikbaar in deze collectie.</p>}
    {showNative && progress >= 0 && <nav className={styles.checkoutProgress} aria-label="Voortgang van je bestelling">
      <ol>{progressSteps.map((label, index) => <li key={label} aria-current={index === progress ? "step" : undefined}>{label}</li>)}</ol>
    </nav>}
    {showNative && checkoutStep && summaryTotal && <button
      type="button"
      className={styles.summaryToggle}
      aria-expanded={summaryOpen}
      onClick={() => setSummaryOpen(open => !open)}
    >
      <span>Besteloverzicht{quantity ? <small>{quantity} {quantity === 1 ? "artikel" : "artikelen"}</small> : null}</span>
      <strong>{summaryTotal}</strong>
      <span aria-hidden="true">{summaryOpen ? "−" : "+"}</span>
    </button>}
    <div className={showNative ? undefined : styles.unavailable} inert={!showNative} aria-hidden={!showNative}>
      <div ref={nativeStore} id={`my-store-${ecwid.storeId}`} data-julie-ecwid-browser="true" data-category-id={categoryId} data-all-products={allProducts ? "true" : undefined} />
    </div>
    {main && loaded && !error && <nav className={styles.serviceLinks} aria-label="Je bestelling"><SiteLink href="/winkel/#!/~/account">Mijn account &amp; bestellingen</SiteLink><SiteLink href="/contact/">Hulp nodig?</SiteLink></nav>}
    <noscript>Voor de winkel is JavaScript nodig. Je kunt Fleur bereiken via de contactpagina.</noscript>
  </div>;
}
