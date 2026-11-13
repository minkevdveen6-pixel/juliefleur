import ecwidCategories from "@/data/ecwid-categories.json";
import { parseEcwidCategories } from "./ecwid-config";

export const site = {
  name: "Julie Fleur",
  description: "Sieraden, bagcharms, punnikwerk en andere persoonlijke producten van Julie Fleur.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://juliefleur.nl",
  launched: process.env.NEXT_PUBLIC_SITE_LAUNCHED === "true",
  instagram: "https://www.instagram.com/juliefleur.nl/",
  // Aangeleverde PNG ongewijzigd bewaard. De ruime buitenmarges worden alleen met CSS gemaskeerd.
  logo: "/images/brand/julie-fleur-original.png" as string | null,
};

export const ecwid = {
  storeId: process.env.NEXT_PUBLIC_ECWID_STORE_ID || "",
  preview: process.env.NEXT_PUBLIC_ECWID_PREVIEW === "true",
  published: process.env.NEXT_PUBLIC_ECWID_CATALOG_PUBLISHED === "true",
  paymentsAvailable: process.env.NEXT_PUBLIC_ECWID_PAYMENTS_AVAILABLE === "true",
  catalogReady: process.env.NEXT_PUBLIC_ECWID_CATALOG_READY === "true",
  enabled: /^\d+$/.test(process.env.NEXT_PUBLIC_ECWID_STORE_ID || "") &&
    (process.env.NEXT_PUBLIC_ECWID_PREVIEW === "true" || process.env.NEXT_PUBLIC_ECWID_CATALOG_PUBLISHED === "true" || (site.launched &&
      process.env.NEXT_PUBLIC_ECWID_ENABLED === "true" &&
      process.env.NEXT_PUBLIC_ECWID_LAUNCH_APPROVED === "true")),
  categoryIds: { ...parseEcwidCategories(process.env.NEXT_PUBLIC_ECWID_CATEGORY_IDS || "{}"), ...parseEcwidCategories(JSON.stringify(ecwidCategories)) },
};

export function pageMetadata(title: string, path: string, description = site.description) {
  return { title, description, alternates: { canonical: path } };
}
