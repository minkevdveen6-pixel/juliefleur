import { arrangeProductInformation } from "./ecwid-product-information";
import styles from "./ecwid-store.module.css";

const normalize = (text: string | null | undefined) =>
  (text ?? "").replace(/\s+/g, " ").trim();

function placeOptionHelp(store: HTMLElement, productId: number | undefined) {
  const description = store.querySelector(".product-details__product-description");
  const heading = Array.from(description?.querySelectorAll("h2, h3, h4, p") ?? []).find(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.matches("h2, h3, h4, p") &&
      normalize(element.textContent).toLowerCase() === "toelichting bij opties",
  );
  const list = heading?.nextElementSibling;
  if (!heading || !(list instanceof HTMLUListElement)) return () => {};

  const entries = new Map<string, { item: HTMLLIElement; text: string }>();
  for (const item of Array.from(list.children)) {
    if (!(item instanceof HTMLLIElement) || item.hidden) continue;
    const line = normalize(item.textContent);
    const separator = line.indexOf(" — ");
    if (separator > 0 && line.length > separator + 3) {
      entries.set(line.slice(0, separator).toLowerCase(), { item, text: line.slice(separator + 3) });
    }
  }

  const restore: (() => void)[] = [];
  store.querySelectorAll(".details-product-option").forEach((option, index) => {
    const label = normalize(option.querySelector(".details-product-option__title")?.textContent);
    const entry = entries.get(label.toLowerCase());
    const content = option.querySelector(".product-details-module__content");
    if (!entry || !content) return;

    const note = document.createElement("p");
    note.id = `julie-option-help-${productId ?? "product"}-${index}`;
    note.className = styles.optionHelp;
    note.textContent = entry.text;
    content.append(note);
    entry.item.hidden = true;
    restore.push(() => {
      note.remove();
      entry.item.hidden = false;
    });

    for (const field of content.querySelectorAll("input:not([type=hidden]), select, textarea, button")) {
      const describedBy = normalize(field.getAttribute("aria-describedby")).split(" ").filter(Boolean);
      field.setAttribute("aria-describedby", [...describedBy, note.id].join(" "));
      restore.push(() => {
        const remaining = normalize(field.getAttribute("aria-describedby")).split(" ")
          .filter((id) => id && id !== note.id);
        if (remaining.length) field.setAttribute("aria-describedby", remaining.join(" "));
        else field.removeAttribute("aria-describedby");
      });
    }
  });

  if (restore.length && Array.from(list.children).every((item) => item.hasAttribute("hidden"))) {
    heading.hidden = true;
    list.hidden = true;
    restore.push(() => {
      heading.hidden = false;
      list.hidden = false;
    });
  }
  return () => restore.forEach((reset) => reset());
}

export function observeOptionHelp(store: HTMLElement, productId: number | undefined) {
  let restore = () => {};
  const refresh = () => {
    observer.disconnect();
    restore();
    arrangeProductInformation(store);
    restore = placeOptionHelp(store, productId);
    observer.observe(store, { childList: true, subtree: true, characterData: true });
  };
  const observer = new MutationObserver(refresh);
  refresh();
  return () => {
    observer.disconnect();
    restore();
  };
}
