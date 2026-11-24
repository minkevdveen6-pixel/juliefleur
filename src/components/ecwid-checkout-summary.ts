// Read the displayed native amounts. Ecwid retains ownership of all price calculations.
export function observeCheckoutSummary(store: HTMLElement, onTotal: (total: string) => void) {
  function update() {
    const sidebar = store.querySelector(".ec-cart__sidebar");
    const total = sidebar?.querySelector(".ec-cart-summary__row--total .ec-cart-summary__cell:last-child");
    const alert = sidebar?.querySelector('[role="alert"]:not([hidden])');
    const text = total?.textContent?.trim() ?? "";
    onTotal(!alert && /^€\s*\d[\d.]*,\d{2}$/.test(text) ? text : "");

    const vatNote = sidebar?.querySelector(".ec-cart-summary__note");
    const vatIncluded = /incl\.?\s*btw/i.test(vatNote?.textContent ?? "");
    sidebar?.querySelectorAll(".ec-cart-summary__row").forEach(row => {
      const label = row.querySelector(".ec-cart-summary__cell:first-child")?.textContent?.trim() ?? "";
      const value = row.querySelector(".ec-cart-summary__cell:last-child")?.textContent?.trim() ?? "";
      const zeroRush = /^Spoedbestelling\b/i.test(label) && /^€\s*0,00$/.test(value);
      const duplicateTax = vatIncluded && /^BTW\s*\(/i.test(label) && !!value && !!vatNote?.textContent?.includes(value);
      row.classList.toggle("julie-checkout-optional-row", zeroRush || duplicateTax);
    });
    const heading = store.querySelector(".ec-cart__body .ec-header-h1");
    if (heading?.textContent?.trim() === "Checkout" && !heading.children.length) heading.textContent = "Afrekenen";
  }

  const observer = new MutationObserver(update);
  observer.observe(store, { childList: true, characterData: true, subtree: true });
  update();
  return () => {
    observer.disconnect();
    store.querySelectorAll(".julie-checkout-optional-row").forEach(row => row.classList.remove("julie-checkout-optional-row"));
  };
}
