import styles from "./ecwid-store.module.css";

const titles = ["Productomschrijving", "Productspecificaties", "Personalisatie", "Levertijd & verzending"] as const;
type Section = (typeof titles)[number];

function sectionFor(node: Element): Section | undefined {
  const lead = (node.querySelector(":scope > :is(strong,b)") ?? node).textContent?.trim().toLowerCase() ?? "";
  if (/^(productspecificaties|materiaal|afmetingen)(?:\s*[:\n]|$)/.test(lead)) return titles[1];
  if (/^(personalisatie|zo stel je|personaliseren)(?:\s*[:\n]|\s|$)/.test(lead)) return titles[2];
  if (/^(levertijd|verwerkingstijd|productie en verzending|verzending)(?:\s*[:\n&]|$)/.test(lead)) return titles[3];
  if (/^(productomschrijving|goed om te weten)$/.test(lead)) return titles[0];
}

export function arrangeProductInformation(store: HTMLElement) {
  const description = store.querySelector<HTMLElement>(".product-details__product-description");
  if (!description || description.dataset.julieAccordion) return;

  const sections = new Map<Section, Node[]>(titles.map((title) => [title, []]));
  let section: Section = titles[0];
  for (const node of Array.from(description.childNodes)) {
    const title = node instanceof Element ? sectionFor(node) : undefined;
    section = title ?? section;
    if (title && node.textContent?.trim().toLowerCase() === title.toLowerCase()) {
      node.parentNode?.removeChild(node);
      continue;
    }
    sections.get(section)?.push(node);
  }

  const attributes = store.querySelector(".product-details__product-attributes");
  if (attributes?.textContent?.trim() && !description.contains(attributes)) sections.get(titles[1])?.push(attributes);

  description.dataset.julieAccordion = "true";
  description.classList.add(styles.productInformation);
  for (const [title, nodes] of sections) {
    if (!nodes.some((node) => node.textContent?.trim() || (node instanceof Element && node.matches("img, video, iframe")))) continue;
    const disclosure = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = title;
    const body = document.createElement("div");
    body.append(...nodes);
    if (title === titles[3]) {
      const shipping = document.createElement("a");
      shipping.href = "/verzenden-bezorgen/";
      shipping.textContent = "Verzenden & bezorgen";
      shipping.className = styles.shippingLink;
      body.append(shipping);
    }
    disclosure.append(summary, body);
    description.append(disclosure);
  }
}
