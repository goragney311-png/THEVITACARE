/**
 * Generates magento-theme/import/products.csv from src/db/seed-data.ts
 * Run: node --experimental-strip-types scripts/generate-magento-csv.ts
 */
import { writeFileSync } from "node:fs";
import { seedProducts, seedCategories } from "../src/db/seed-data.ts";

const catName = new Map(seedCategories.map((c) => [c.slug, c.name]));
const esc = (v: unknown) => {
  const s = String(v ?? "").replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
};

const header = [
  "sku", "store_view_code", "attribute_set_code", "product_type", "categories", "product_websites", "name",
  "description", "short_description", "weight", "product_online", "tax_class_name", "visibility", "price", "special_price",
  "url_key", "meta_title", "meta_description", "base_image", "base_image_label", "small_image", "small_image_label",
  "thumbnail_image", "thumbnail_image_label", "qty", "is_in_stock", "manage_stock", "custom_options", "additional_attributes",
];

const rows = seedProducts.map((p) => {
  const variants = p.variants ?? [];
  const base = variants.length ? Math.min(...variants.map((v) => v.price)) : Number(p.price);
  const special = p.salePrice && variants.length <= 1 ? Number(p.salePrice) : "";
  const price = p.salePrice && variants.length <= 1 ? Number(p.price) : base;

  // Variants -> single required dropdown custom option; option price = surcharge over base.
  const customOptions =
    variants.length > 1
      ? variants
          .map((v) =>
            [
              "name=Pack Size / Option", "type=drop_down", "required=1", "price_type=fixed",
              `price=${(v.price - base).toFixed(2)}`, `sku=${v.label.replace(/\s+/g, "").toUpperCase()}`, `option_title=${v.label}`,
            ].join(","),
          )
          .join("|")
      : "";

  const benefitsHtml = "<ul>" + p.benefits.map((b) => `<li>${b}</li>`).join("") + "</ul>";
  const description =
    `<p>${p.description}</p>` +
    `<h3>Key Benefits</h3>${benefitsHtml}` +
    (p.ingredients ? `<h3>Ingredients / Composition</h3><p>${p.ingredients}</p>` : "") +
    (p.dosage ? `<h3>How to Use</h3><p>${p.dosage}</p>` : "");

  const additional = [
    `brand=${p.brand ?? "The Vita Care"}`,
    `form=${p.form}`,
    `ingredients=${(p.ingredients ?? "").replace(/,/g, "،")}`,
    `dosage=${(p.dosage ?? "").replace(/,/g, "،")}`,
    `benefits=${benefitsHtml.replace(/,/g, "،")}`,
  ].join(",");

  const img = p.image.replace("/images/", "");
  return [
    p.sku ?? p.slug.toUpperCase(), "", "Default", "simple", `Default Category/${catName.get(p.category)}`, "base", p.name,
    description, p.shortDescription, "0.2", "1", "Taxable Goods", "Catalog, Search", price.toFixed(2), special === "" ? "" : Number(special).toFixed(2),
    p.slug, p.name, p.shortDescription, img, p.name, img, p.name, img, p.name, "100", "1", "1", customOptions, additional,
  ].map(esc).join(",");
});

writeFileSync("magento-theme/import/products.csv", [header.join(","), ...rows].join("\n") + "\n");
console.log(`Wrote ${rows.length} products to magento-theme/import/products.csv`);
