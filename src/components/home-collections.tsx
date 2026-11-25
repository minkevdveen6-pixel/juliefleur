"use client";

import { useEffect, useState } from "react";
import { PhotoSpace } from "@/components/placeholder";
import { SiteLink } from "@/components/site-link";
import { ecwid } from "@/lib/site";
import styles from "@/app/home.module.css";

const featuredCollections = [
  { slug: "sieraden-graveren", label: "Sieraden & graveren" },
  { slug: "bagcharms", label: "Bagcharms" },
  { slug: "punniken", label: "Punniken" },
  { slug: "borduren", label: "Borduren" },
  { slug: "vilten-kroon", label: "Vilten kroon" },
];

type Collection = { id: number; image: string | null; label: string };

export function HomeCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    if (!ecwid.enabled) return;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch("/api/collection-images", { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json() as { collections: Collection[] };
        if (!controller.signal.aborted) setCollections(data.collections);
      } catch {
        // Keep the previous successfully loaded images if Ecwid is temporarily unavailable.
      }
    };
    void refresh();
    const timer = window.setInterval(refresh, 120_000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  const images = new Map(collections.map(({ id, image }) => [id, image]));
  const existingIds = new Set(Object.values(ecwid.categoryIds));
  const cards = [
    ...featuredCollections.map(({ slug, label }) => ({
      href: `/collecties/${slug}`,
      slot: `category:${slug}`,
      image: images.get(ecwid.categoryIds[slug]),
      label,
    })),
    ...collections.filter(({ id }) => !existingIds.has(id)).map(({ id, image, label }) => ({
      href: `/winkel/#!/${encodeURIComponent(label)}/c/${id}`,
      slot: undefined,
      image,
      label,
    })),
  ];

  return <div className={styles.collectionGrid}>
    {cards.map(({ href, image, label, slot }) => <SiteLink className={styles.category} href={href} key={href}>
      <div className={styles.collectionImage}>
        <PhotoSpace slot={slot} image={image} alt={label} kind="home-category" fit="cover" />
      </div>
      <div className={styles.categoryCaption}><h3>{label}</h3></div>
    </SiteLink>)}
  </div>;
}
