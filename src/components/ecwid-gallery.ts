import styles from "./ecwid-store.module.css";

// The native mobile gallery uses its thumbnails as a swipe feed.
// Reuse its original image metadata and links for a main image and compact strip.
export function observeProductGallery(store: HTMLElement) {
  const mobile = window.matchMedia("(max-width: 600px)");
  let gallery: HTMLElement | null = null;
  let main: HTMLImageElement | null = null;
  let selected = 0;

  const thumbnails = () => Array.from(gallery?.querySelectorAll<HTMLElement>(".details-gallery__thumb") ?? [])
    .filter(thumb => thumb.querySelector('meta[itemprop="image"][content]'));
  const select = (index: number) => {
    const items = thumbnails();
    const thumb = items[index];
    const source = thumb?.querySelector<HTMLMetaElement>('meta[itemprop="image"]')?.content;
    if (!main || !source) return;
    selected = index;
    main.src = source;
    main.alt = thumb.querySelector("a[aria-label]")?.getAttribute("aria-label") ?? "Productfoto";
    items.forEach((item, i) => {
      const link = item.querySelector("a");
      if (i === index) link?.setAttribute("aria-current", "true");
      else link?.removeAttribute("aria-current");
    });
  };
  const refresh = () => {
    observer.disconnect();
    const next = store.querySelector<HTMLElement>(".details-gallery");
    if (next !== gallery) {
      gallery?.classList.remove(styles.mobileGallery);
      main?.remove();
      main = null;
      selected = 0;
      gallery = next;
    }
    if (mobile.matches && gallery && thumbnails().length) {
      gallery.classList.add(styles.mobileGallery);
      if (!main) {
        main = document.createElement("img");
        main.className = styles.mobileGalleryImage;
        main.decoding = "async";
        gallery.prepend(main);
      }
      select(Math.min(selected, thumbnails().length - 1));
    } else {
      gallery?.classList.remove(styles.mobileGallery);
      thumbnails().forEach(thumb => thumb.querySelector("a")?.removeAttribute("aria-current"));
      main?.remove();
      main = null;
    }
    observer.observe(store, { childList: true, subtree: true });
  };
  const observer = new MutationObserver(refresh);
  const click = (event: MouseEvent) => {
    if (!mobile.matches || !main || !(event.target instanceof Element)) return;
    const thumb = event.target.closest<HTMLElement>(".details-gallery__thumb");
    const index = thumbnails().indexOf(thumb!);
    if (index < 0) return;
    // Keep Ecwid's extra-images tile available for opening the complete gallery.
    if (thumb?.classList.contains("details-gallery__thumb--more")) return;
    event.preventDefault();
    event.stopPropagation();
    select(index);
  };
  store.addEventListener("click", click, true);
  mobile.addEventListener("change", refresh);
  refresh();
  return () => {
    observer.disconnect();
    store.removeEventListener("click", click, true);
    mobile.removeEventListener("change", refresh);
    gallery?.classList.remove(styles.mobileGallery);
    thumbnails().forEach(thumb => thumb.querySelector("a")?.removeAttribute("aria-current"));
    main?.remove();
  };
}
