import styles from "./ecwid-store.module.css";

const sections = [
  ["Productspecificaties", /^(productspecificaties|materiaal|afmetingen|kleur|lengte ketting)$/i],
  ["Personalisatie", /^(personalisatie|personaliseren|zo stel je .+|stel .+ samen)$/i],
  ["Productie- en verwerkingstijd", /^(productie- en verwerkingstijd|verwerkingstijd|productietijd)$/i],
  ["Levertijd & verzending", /^(levertijd & verzending|levertijd en verzending|productie en verzending|levertijd|verzending)$/i],
  ["Onderhoud", /^(onderhoud|onderhoudsinstructies)$/i],
] as const;

type Title = (typeof sections)[number][0];
const normalize = (value: string | null | undefined) => (value ?? "").replace(/\s+/g, " ").trim();

function hasContent(node: Node) {
  return !!normalize(node.textContent) ||
    (node instanceof Element && (node.matches("img, video, iframe") || !!node.querySelector("img, video, iframe")));
}

function readHeading(node: Element) {
  const emphasis = node.querySelector(":scope > :is(strong, b):not(:empty)");
  const lead = normalize((emphasis ?? node).textContent);
  const split = lead.indexOf(":");
  const label = (split === -1 ? lead : lead.slice(0, split)).trim();
  const section = sections.find(([, pattern]) => pattern.test(label));
  if (!section && !/^(productomschrijving|goed om te weten|met aandacht gemaakt)$/i.test(label)) return;
  // A full heading, or a label separated from its value by a colon or line break.
  if (!emphasis && split === -1 && !node.matches("h2, h3, h4, p")) return;
  return { title: section?.[0], label, emphasis, split };
}

export function arrangeProductInformation(store: HTMLElement) {
  const description = store.querySelector<HTMLElement>(".product-details__product-description");
  const attributes = store.querySelector<HTMLElement>(".product-details__product-attributes");
  const anchor = description ?? attributes;
  if (!anchor) return;
  const previous = store.querySelector<HTMLElement>("[data-julie-product-info]");
  const source = JSON.stringify([description?.innerHTML, attributes?.innerHTML]);
  if (previous?.previousElementSibling === anchor && previous.dataset.source === source) return;
  const opened = new Set(Array.from(previous?.querySelectorAll("details[open] > summary") ?? [], item => item.textContent));
  previous?.remove();

  const intro: Node[] = [];
  const grouped = new Map<Title, Node[]>(sections.map(([title]) => [title, []]));
  let target = intro;
  for (const node of Array.from(description?.childNodes ?? [])) {
    if (node instanceof HTMLElement && node.hidden) continue;
    const copy = node.cloneNode(true);
    if (!(copy instanceof Element)) {
      target.push(copy);
      continue;
    }

    let heading = readHeading(copy);
    if (heading?.emphasis && /^productomschrijving$/i.test(heading.label) && heading.split === -1) {
      // Ecwid's editor can put two headings in one block separated by a line break.
      heading.emphasis.remove();
      if (copy.firstElementChild?.matches("br")) copy.firstElementChild.remove();
      target = intro;
      heading = readHeading(copy);
    }
    if (!heading) {
      target.push(copy);
      continue;
    }

    target = heading.title ? grouped.get(heading.title)! : intro;
    if (/^(materiaal|afmetingen|kleur|lengte ketting|goed om te weten|met aandacht gemaakt)$/i.test(heading.label)) {
      target.push(copy);
      continue;
    }
    if (heading.emphasis && heading.split === -1) {
      copy.querySelector(":scope > :is(strong, b):not(:empty)")?.remove();
      if (copy.firstElementChild?.matches("br")) copy.firstElementChild.remove();
    } else if (heading.split !== -1) {
      const text = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
      while (text.nextNode()) {
        const part = text.currentNode;
        const colon = part.textContent?.indexOf(":") ?? -1;
        part.textContent = colon < 0 ? "" : part.textContent!.slice(colon + 1).trimStart();
        if (colon >= 0) break;
      }
    } else {
      continue;
    }
    if (hasContent(copy)) target.push(copy);
  }

  if (attributes && !description?.contains(attributes) && hasContent(attributes)) {
    const specs = grouped.get("Productspecificaties")!;
    const duplicate = specs.some(node => normalize(node.textContent) === normalize(attributes.textContent));
    if (!duplicate) {
      const copy = attributes.cloneNode(true) as HTMLElement;
      copy.classList.remove(styles.informationSource);
      specs.push(copy);
    }
  }

  const information = document.createElement("div");
  information.dataset.julieProductInfo = "true";
  information.dataset.source = source;
  const visibleIntro = document.createElement("div");
  visibleIntro.className = styles.productDescription;
  visibleIntro.append(...intro);
  if (intro.some(hasContent)) information.append(visibleIntro);

  const accordion = document.createElement("div");
  accordion.className = styles.productInformation;
  for (const [title, nodes] of grouped) {
    if (!nodes.some(node => hasContent(node) &&
      !/^(materiaal|afmetingen|kleur|lengte ketting)\s*:?$/i.test(normalize(node.textContent)))) continue;
    const disclosure = document.createElement("details");
    disclosure.open = opened.has(title);
    const summary = document.createElement("summary");
    summary.textContent = title;
    const body = document.createElement("div");
    body.append(...nodes);
    if (title === "Levertijd & verzending" && !body.querySelector('a[href*="verzenden-bezorgen"]')) {
      const shipping = document.createElement("a");
      shipping.href = "/verzenden-bezorgen/";
      shipping.textContent = "Verzenden & bezorgen";
      shipping.className = styles.shippingLink;
      body.append(shipping);
    }
    disclosure.append(summary, body);
    accordion.append(disclosure);
  }
  if (accordion.childElementCount) information.append(accordion);
  description?.classList.add(styles.informationSource);
  attributes?.classList.add(styles.informationSource);
  anchor.after(information);
}
