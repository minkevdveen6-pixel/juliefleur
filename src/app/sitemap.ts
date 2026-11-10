import type { MetadataRoute } from "next";
import { categories,products } from "@/data/catalog";
import { pages } from "@/data/pages";
import { ecwid,site } from "@/lib/site";
export const dynamic="force-static";
export default function sitemap():MetadataRoute.Sitemap {if(!site.launched)return [];return ["/","/collecties/","/contact/",...categories.map(c=>`/collecties/${c.slug}/`),...(!ecwid.enabled?products.map(p=>`/producten/${p.slug}/`):["/winkel/"]),...Object.keys(pages).map(slug=>`/${slug}/`)].map(path=>({url:`${site.url}${path}`,changeFrequency:"monthly",priority:path==="/"?1:0.6}));}
