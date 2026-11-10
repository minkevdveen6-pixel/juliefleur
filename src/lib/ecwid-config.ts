// Alleen echte Ecwid-categorie-ID's; ontbrekende categorieën krijgen geen fictieve koppeling.
export function parseEcwidCategories(value: string): Record<string, number> {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([slug, id]) =>
      /^[a-z0-9-]+$/.test(slug) && Number.isSafeInteger(id) && id > 0));
  } catch { return {}; }
}
