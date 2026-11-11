"use client";
import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ecwid } from "@/lib/site";
import { cartSummary, isSampleProduct, type EcwidCart, type EcwidPage } from "@/lib/ecwid-integration";

type EcwidEvent<T, R = void> = { add: (callback: (value: T) => R) => void; remove: (callback: (value: T) => R) => void };
declare global {
  interface Window {
    ecwid_script_defer?: boolean;
    ecwidMessages?: Record<string, string>;
    _xnext_initialization_scripts?: { widgetType: string; id: string; arg: string[] }[];
    ec?: { config?: Record<string, unknown>; storefront?: Record<string, unknown> };
    Ecwid?: {
      init: () => void;
      openPage: (page: string, params?: Record<string, unknown>) => void;
      setStorefrontBaseUrl?: (url: string) => void;
      refreshConfig?: () => void;
      OnAPILoaded: EcwidEvent<void>;
      OnPageSwitch: EcwidEvent<EcwidPage, boolean | void>;
      OnPageLoaded: EcwidEvent<EcwidPage>;
      OnCartChanged: EcwidEvent<EcwidCart>;
      Cart: { get: (callback: (cart: EcwidCart) => void) => void };
      getOwnerId: () => number;
    };
  }
}
const Context = createContext({ ready: false, error: false, page: { type: "LOADING" } as EcwidPage,
  quantity: null as number | null, containsSamples: false });
export const useEcwid = () => useContext(Context);

export function EcwidProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState<EcwidPage>({ type: "LOADING" });
  const [cart, setCart] = useState<{ quantity: number | null; containsSamples: boolean }>({ quantity: null, containsSamples: false });
  const started = useRef(false);
  const apiResolved = useRef(false);
  const cleanup = useRef<() => void>(() => {});
  const initialize = useCallback(() => {
    if (started.current) return;
    const api = window.Ecwid;
    if (!api) { setError(true); return; }
    started.current = true;
    const onCart = (value: EcwidCart) => setCart(cartSummary(value));
    const onApi = () => {
      if (String(api.getOwnerId()) !== ecwid.storeId) { setError(true); return; }
      apiResolved.current = true;
      setReady(true);
      api.Cart.get(onCart);
      api.setStorefrontBaseUrl?.(`${window.location.origin}/winkel/`);
      api.refreshConfig?.();
      const requestedProduct = new URLSearchParams(window.location.search).get("product");
      if (requestedProduct && /^[1-9]\d*$/.test(requestedProduct) && !window.location.hash) {
        api.openPage("product", { id: Number(requestedProduct) });
      } else if (browser?.dataset.categoryId && !window.location.hash) {
        api.openPage("category", { id: Number(browser.dataset.categoryId) });
      }
    };
    const onSwitch = (next: EcwidPage) => {
      if (isSampleProduct(next.productId)) { setPage({ type: "BLOCKED" }); return false; }
      if (next.type === "PRODUCT" && next.productId && window.location.pathname !== "/winkel/") {
        // Ecwid registreert de browser per document; een zachte Next-route houdt de oude categorie-widget vast.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`/winkel/?product=${next.productId}`);
        return false;
      }
      if (next.type === "CATEGORY" && !ecwid.catalogReady && !Object.values(ecwid.categoryIds).includes(next.categoryId || 0)) {
        setPage({ type: "CATEGORY", categoryId: 0 }); return false;
      }
      setPage({ type: "LOADING" });
    };
    const onPage = (next: EcwidPage) => {
      if (String(api.getOwnerId()) !== ecwid.storeId) { setError(true); return; }
      setPage(next);
    };
    api.OnAPILoaded.add(onApi);
    api.OnPageSwitch.add(onSwitch);
    api.OnPageLoaded.add(onPage);
    api.OnCartChanged.add(onCart);
    cleanup.current = () => {
      api.OnAPILoaded.remove(onApi); api.OnPageSwitch.remove(onSwitch);
      api.OnPageLoaded.remove(onPage); api.OnCartChanged.remove(onCart);
    };
    const browser = document.querySelector<HTMLElement>("[data-julie-ecwid-browser]");
    const tokens = getComputedStyle(document.documentElement);
    window.ec = window.ec || {};
    window.ec.config = { ...window.ec.config,
      store_main_page_url: `${window.location.origin}/winkel/`,
      chameleon: { font: { "font-family": tokens.getPropertyValue("--sans").trim() }, colors: {
        "color-background": tokens.getPropertyValue("--ivory").trim(),
        "color-foreground": tokens.getPropertyValue("--wine").trim(),
        "color-link": tokens.getPropertyValue("--olive").trim(),
        "color-button": tokens.getPropertyValue("--olive").trim(),
        "color-price": tokens.getPropertyValue("--wine").trim(),
      } },
    };
    window.ec.storefront = {
      ...window.ec.storefront,
      show_root_categories: false, show_footer_menu: false, show_signin_link: false,
      // De volledige catalogus mag niet afhangen van de selectie 'Uitgelicht op de startpagina'.
      hide_category_block_show_all_enabled_products: browser?.dataset.allProducts === "true",
      show_breadcrumbs: false, product_details_show_breadcrumbs: false,
      product_list_show_sort_viewas_options: true,
      product_list_image_size: "MEDIUM", product_list_image_aspect_ratio: "SQUARE_1",
      product_list_image_position: "FIT", product_list_image_has_shadow: false,
      product_list_product_info_layout: "LEFT", productListCardSpacingType: "medium",
      product_list_title_behavior: "SHOW", product_list_price_behavior: "SHOW",
      product_list_sku_behavior: "HIDE", product_list_subtitles_behavior: "HIDE",
      product_list_buybutton_behavior: "HIDE", product_list_show_frame: false,
      product_details_layout: "TWO_COLUMNS_SIDEBAR_ON_THE_RIGHT",
      product_details_gallery_layout: "IMAGE_SINGLE_THUMBNAILS_HORIZONTAL",
      product_details_gallery_image_position: "FIT", product_details_show_product_options: true,
      product_details_show_buy_button: true, product_details_show_qty: true,
      product_details_show_in_stock_label: true, product_details_show_product_sku: false,
      product_details_show_share_buttons: false,
      shopping_cart_show_qty_inputs: true, shopping_cart_show_sku: false, shopping_cart_show_weight: false,
    };
    window._xnext_initialization_scripts = browser ? [{ widgetType: "ProductBrowser", id: browser.id,
      arg: [`id=${browser.id}`, "views=grid(1,16)", "categoryView=grid", "searchView=grid",
        ...(browser.dataset.categoryId ? [`defaultCategoryId=${browser.dataset.categoryId}`] : [])] }] : [];
    try { api.init(); } catch { setError(true); }
  }, []);
  useEffect(() => {
    if (!ecwid.enabled) return;
    const timeout = setTimeout(() => setError(current => current || !apiResolved.current), 30000);
    return () => { clearTimeout(timeout); cleanup.current(); };
  }, []);
  return <Context.Provider value={{ ready, error, page, ...cart }}>{children}{ecwid.enabled &&
    <Script id="ecwid-storefront" src={`https://app.ecwid.com/script.js?${ecwid.storeId}&data_platform=code`} strategy="afterInteractive" onReady={initialize} onError={() => setError(true)} data-cfasync="false" />
  }</Context.Provider>;
}
