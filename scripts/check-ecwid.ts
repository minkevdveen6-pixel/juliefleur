import assert from "node:assert/strict";
import { reviewEnvironment } from "./review-environment.mjs";
import { canShowEcwidPage, cartSummary, isServicePage, isSampleProduct } from "../src/lib/ecwid-integration.ts";
import { parseEcwidCategories } from "../src/lib/ecwid-config.ts";

const supplied = {
  ECWID_PREVIEW_ENABLED: "true", NEXT_PUBLIC_ECWID_STORE_ID: "145090752",
  ECWID_CATALOG_READY: "true", NEXT_PUBLIC_ECWID_CATEGORY_IDS: '{"bagcharms":123}',
  NEXT_PUBLIC_SITE_LAUNCHED: "true", NEXT_PUBLIC_ECWID_ENABLED: "true",
  NEXT_PUBLIC_ECWID_LAUNCH_APPROVED: "true", NEXT_PUBLIC_ECWID_PREVIEW: "true",
};
const preview = reviewEnvironment({ ...supplied, VERCEL_ENV: "preview" });
assert.equal(preview.NEXT_PUBLIC_ECWID_STORE_ID, "145090752");
assert.equal(preview.NEXT_PUBLIC_ECWID_PREVIEW, "true");
assert.equal(preview.NEXT_PUBLIC_SITE_LAUNCHED, "false");
assert.equal(reviewEnvironment({ ...supplied, ECWID_CATALOG_READY: "false", VERCEL_ENV: "preview" }).NEXT_PUBLIC_ECWID_CATALOG_READY, "false");
for (const VERCEL_ENV of ["production", "development"]) {
  const result = reviewEnvironment({ ...supplied, VERCEL_ENV });
  assert.equal(result.NEXT_PUBLIC_ECWID_PREVIEW, "false");
  assert.equal(result.NEXT_PUBLIC_ECWID_STORE_ID, "");
  assert.equal(result.NEXT_PUBLIC_ECWID_CATALOG_READY, "false");
  assert.equal(result.NEXT_PUBLIC_ECWID_ENABLED, "false");
  assert.equal(result.NEXT_PUBLIC_SITE_LAUNCHED, "false");
}
assert.equal(reviewEnvironment({}).NEXT_PUBLIC_ECWID_PREVIEW, "false");
assert.throws(() => reviewEnvironment({ VERCEL_ENV: "preview", ECWID_PREVIEW_ENABLED: "true", NEXT_PUBLIC_ECWID_STORE_ID: "not-an-id" }));
assert.deepEqual(parseEcwidCategories('{"bagcharms":123,"negative":-1,"zero":0,"text":"123","fraction":1.5,"bad slug":456}'), { bagcharms: 123 });
for (const value of ["[]", "null", "bad-json", '"bagcharms"']) assert.deepEqual(parseEcwidCategories(value), {});
const published = reviewEnvironment({ ...supplied, VERCEL_ENV: "production", ECWID_CATALOG_PUBLISHED: "true" });
assert.equal(published.NEXT_PUBLIC_ECWID_STORE_ID, "145090752");
assert.equal(published.NEXT_PUBLIC_ECWID_PREVIEW, "false");
assert.equal(published.NEXT_PUBLIC_ECWID_CATALOG_PUBLISHED, "true");
assert.equal(published.NEXT_PUBLIC_ECWID_CATALOG_READY, "true");
assert.equal(published.NEXT_PUBLIC_ECWID_PAYMENTS_AVAILABLE, "false");
assert.equal(published.NEXT_PUBLIC_SITE_LAUNCHED, "false");
assert.equal(reviewEnvironment({ ...supplied, ECWID_CATALOG_PUBLISHED: "true", VERCEL_ENV: "development" }).NEXT_PUBLIC_ECWID_CATALOG_PUBLISHED, "false");
assert.throws(() => reviewEnvironment({ VERCEL_ENV: "production", ECWID_CATALOG_PUBLISHED: "true", NEXT_PUBLIC_ECWID_STORE_ID: "123" }));
console.log("Ecwid-omgeving geslaagd: expliciete productievrijgave voor winkel 145090752; Preview-lekkage, andere winkels en onbedoelde betaalmelding geblokkeerd; noindex behouden.");

// Presentatiebeleid: echte categorieën kunnen automatisch doorlopen; demoproducten nooit.
assert.equal(canShowEcwidPage({ type: "CATEGORY", categoryId: 123 }, [123], false), true);
assert.equal(canShowEcwidPage({ type: "CATEGORY", categoryId: 0 }, [123], false), false);
assert.equal(canShowEcwidPage({ type: "PRODUCT", productId: 876029266, mainCategoryId: 123 }, [123], true), false);
assert.equal(canShowEcwidPage({ type: "PRODUCT", productId: 1, mainCategoryId: 123 }, [123], false), true);
assert.equal(canShowEcwidPage({ type: "PRODUCT", productId: 1, mainCategoryId: 999 }, [123], false), false);
assert.equal(canShowEcwidPage({ type: "SEARCH" }, [], false), false);
for (const type of ["CART", "CHECKOUT_ADDRESS", "CHECKOUT_DELIVERY", "CHECKOUT_PAYMENT_DETAILS", "CHECKOUT_ADDRESS_BOOK", "ACCOUNT_ROOT", "SIGN_IN", "ORDER_CONFIRMATION", "ORDER_FAILURE"]) assert.equal(isServicePage(type), true);
assert.equal(isSampleProduct(876029268), true);
assert.deepEqual(cartSummary({ productsQuantity: 0, items: [] }), { quantity: 0, containsSamples: false });
assert.deepEqual(cartSummary({ items: [{ quantity: 2, product: { id: 1 } }, { quantity: 3, product: { id: 2 } }] }), { quantity: 5, containsSamples: false });
assert.equal(cartSummary({ productsQuantity: 1, items: [{ quantity: 1, product: { id: 876029266 } }] }).containsSamples, true);
console.log("Ecwid-presentatiebeleid geslaagd: echte categorieën, sampleblokkade, alle checkoutstappen, account en native aantallen.");
