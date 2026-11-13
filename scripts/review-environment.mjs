export function reviewEnvironment(environment) {
  // Preview-variabelen alleen geven nooit productievrijgave.
  const preview = environment.ECWID_PREVIEW_ENABLED === "true" &&
    (environment.VERCEL_ENV === "preview" || !environment.VERCEL_ENV);
  const storeId = environment.NEXT_PUBLIC_ECWID_STORE_ID || "";
  const published = environment.VERCEL_ENV === "production" && environment.ECWID_CATALOG_PUBLISHED === "true";
  const active = preview || published;
  if (active && storeId !== "145090752") throw new Error("Alleen Ecwid-winkel 145090752 is vrijgegeven voor Julie Fleur.");
  return {
    NEXT_PUBLIC_SITE_URL: "https://juliefleur.nl",
    NEXT_PUBLIC_SITE_LAUNCHED: "false",
    NEXT_PUBLIC_ECWID_STORE_ID: active ? storeId : "",
    NEXT_PUBLIC_ECWID_PREVIEW: String(preview),
    NEXT_PUBLIC_ECWID_CATALOG_PUBLISHED: String(published),
    NEXT_PUBLIC_ECWID_PAYMENTS_AVAILABLE: "false",
    NEXT_PUBLIC_ECWID_CATALOG_READY: String(active && environment.ECWID_CATALOG_READY === "true"),
    NEXT_PUBLIC_ECWID_CATEGORY_IDS: active ? environment.NEXT_PUBLIC_ECWID_CATEGORY_IDS || "{}" : "{}",
    NEXT_PUBLIC_ECWID_ENABLED: "false",
    NEXT_PUBLIC_ECWID_LAUNCH_APPROVED: "false",
  };
}
