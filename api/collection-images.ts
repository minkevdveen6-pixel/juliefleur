import type { IncomingMessage, ServerResponse } from "node:http";

const storeId = "145090752";
const snapshotUrl = `https://storefront.ecwid.com/home-page/${storeId}/static-code?limit=20`;
const imageHost = "d2j6dbq0eux0bg.cloudfront.net";

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}

function decodeTitle(title: string) {
  return title.replaceAll("\u200b", "").replace(/&(?:amp|quot|lt|gt|#39);/g, entity =>
    ({ "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#39;": "'" })[entity] ?? entity
  ).trim();
}

export function extractCollections(html: string) {
  const collections = [];
  // The documented public storefront snapshot exposes category IDs on its image links.
  for (const [, tag, body] of html.matchAll(/(<a\b[^>]*\bclass="grid-category__image"[^>]*>)([\s\S]*?)<\/a>/g)) {
    const categoryId = attribute(tag, "data-category-id");
    const label = decodeTitle(attribute(tag, "title") ?? "");
    if (!categoryId || !/^[1-9]\d*$/.test(categoryId) || !label) continue;
    const imageTag = body.match(/<img\b[^>]*>/)?.[0] ?? "";
    const source = attribute(imageTag, "src");
    const prefix = `https://${imageHost}/images/${storeId}/categories/${categoryId}/`;
    const image = source?.startsWith(prefix) && /^\d+\.[a-z]+$/i.test(source.slice(prefix.length))
      ? source : null;
    collections.push({ id: Number(categoryId), image, label });
  }
  return collections;
}

export default async function collectionImages(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.writeHead(405).end("{}");
    return;
  }

  try {
    const upstream = await fetch(snapshotUrl, { signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (!upstream.ok) throw new Error("Ecwid snapshot unavailable");
    const { htmlCode } = await upstream.json();
    if (typeof htmlCode !== "string") throw new Error("Invalid Ecwid snapshot");
    const collections = extractCollections(htmlCode);
    if (!collections.length) throw new Error("No Ecwid categories found");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=120");
    res.end(JSON.stringify({ collections }));
  } catch {
    res.writeHead(502).end("{}");
  }
}
