import NextLink from "next/link";
import type { ComponentProps } from "react";
import { ecwid } from "@/lib/site";

// Volledige navigatie voorkomt een achtergebleven Ecwid-widget bij App Router-overgangen.
export function SiteLink(props: ComponentProps<"a"> & { href: string }) {
  return ecwid.enabled ? <a {...props} /> : <NextLink {...props} />;
}
