export type EcwidPage = { type: string; categoryId?: number; mainCategoryId?: number; productId?: number; name?: string };
export type EcwidCart = { productsQuantity?: number; items?: { quantity: number; product: { id: number } }[] };
// Werkelijk aangetroffen standaardartikelen, geen verzonnen product-ID's.
export const ecwidSampleIds = [876029264, 876029265, 876029266, 876029267, 876029268];
export function isSampleProduct(id: number | undefined) { return id !== undefined && ecwidSampleIds.includes(id); }
export function cartSummary(cart: EcwidCart) {
  const quantity = cart.productsQuantity ?? cart.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  return { quantity: Math.max(0, Number.isFinite(quantity) ? quantity : 0), containsSamples: !!cart.items?.some(item => isSampleProduct(item.product.id)) };
}
export function isServicePage(type: string) {
  return type === "CART" || type.startsWith("CHECKOUT_") || type.startsWith("ACCOUNT_") ||
    ["SIGN_IN", "ORDER_CONFIRMATION", "ORDER_FAILURE", "DOWNLOAD_ERROR", "FAVORITES"].includes(type);
}
export function canShowEcwidPage(page: EcwidPage, categoryIds: number[], catalogReady: boolean) {
  if (isServicePage(page.type)) return true;
  if (page.type === "PRODUCT") return !isSampleProduct(page.productId) &&
    (catalogReady || categoryIds.includes(page.mainCategoryId || page.categoryId || 0));
  if (page.type === "CATEGORY") return catalogReady || categoryIds.includes(page.categoryId || 0);
  if (page.type === "SEARCH") return catalogReady;
  return false;
}
