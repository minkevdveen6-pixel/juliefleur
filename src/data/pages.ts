import content from "./content.json" with {type:"json"};
import { ecwid } from "@/lib/site";
export type InfoSection = { title: string; paragraphs: string[]; links?: {label:string;href:string}[] };
export type InfoPage = { title: string; eyebrow: string; intro: string; kind?: "about"|"faq"; collapsible?: boolean; sections: InfoSection[] };
export const pages=content as Record<string,InfoPage>;
if (ecwid.enabled) {
  // De bestaande productie-teksten blijven bewaard zolang Ecwid daar niet actief is.
  for (const key of ["cookiebeleid", "privacybeleid"]) {
    pages[key] = { ...pages[key], sections: pages[key].sections.map(section => ({
      ...section,
      paragraphs: section.paragraphs.map(text => text.replace("Ecwid en het contactformulier zijn niet actief.", "De winkel gebruikt Ecwid voor producten, winkelwagen en afrekenen. Het contactformulier verzendt nog geen berichten.")),
    })).concat({ title: "Winkelfuncties via Ecwid", paragraphs: [
      "In deze beoordelingsversie wordt de Ecwid-winkel geladen. Ecwid verwerkt technische verzoekgegevens en kan noodzakelijke browseropslag gebruiken om de winkelwagen en de winkel te laten werken. De eigen website voegt geen advertentie- of analysescripts toe. Eventuele aanvullende toestemming binnen de winkel wordt door Ecwid zelf gevraagd.",
    ] }) };
  }
}
