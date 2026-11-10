import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export const dynamic="force-static";
export default function robots():MetadataRoute.Robots { return {rules:{userAgent:"*",allow:site.launched?"/":undefined,disallow:site.launched?["/zoeken/","/privacybeleid/","/algemene-voorwaarden/","/cookiebeleid/"]:"/"},sitemap:`${site.url}/sitemap.xml`}; }
