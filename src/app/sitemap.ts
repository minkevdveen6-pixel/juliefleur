import type { MetadataRoute } from "next";
import { categories } from "@/data/catalog";
import { pages } from "@/data/pages";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable) return [];

  // Producten en afrekenen delen de client-side Ecwid-route /winkel/.
  const paths = [
    "/", "/collecties/", "/bestsellers/", "/reviews/", "/contact/",
    ...categories.map(category => `/collecties/${category.slug}/`),
    ...Object.keys(pages).map(slug => `/${slug}/`),
  ];

  return [...new Set(paths)].map(path => ({ url: new URL(path, site.url).href }));
}
