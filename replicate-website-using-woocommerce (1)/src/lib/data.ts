import { db } from "@/db";
import { categories, products, type Product, type Category } from "@/db/schema";
import { seedCategories, seedProducts } from "@/db/seed-data";
import { eq, desc, ilike, and, sql, type SQL } from "drizzle-orm";

let seedPromise: Promise<void> | null = null;

async function runSeed() {
  await db.transaction(async (tx) => {
    // Advisory lock prevents concurrent seeding from multiple workers/requests.
    await tx.execute(sql`select pg_advisory_xact_lock(424242)`);
    const existing = await tx.select({ id: categories.id }).from(categories).limit(1);
    if (existing.length > 0) return;
    const insertedCats = await tx.insert(categories).values(seedCategories).returning();
    const catMap = new Map(insertedCats.map((c) => [c.slug, c.id]));
    await tx.insert(products).values(
      seedProducts.map(({ category, ...p }) => ({
        ...p,
        salePrice: p.salePrice ?? null,
        variants: p.variants ?? [],
        categoryId: catMap.get(category)!,
      })),
    );
  });
}

export function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = runSeed().catch((e) => {
      seedPromise = null;
      throw e;
    });
  }
  return seedPromise;
}

export type ProductWithCategory = Product & { category: Category };

function joinRows(rows: { products: Product; categories: Category }[]): ProductWithCategory[] {
  return rows.map((r) => ({ ...r.products, category: r.categories }));
}

export async function getCategories() {
  await ensureSeeded();
  return db.select().from(categories).orderBy(categories.id);
}

export async function getProducts(opts: { category?: string; q?: string; sort?: string } = {}) {
  await ensureSeeded();
  const filters: SQL[] = [];
  if (opts.category) filters.push(eq(categories.slug, opts.category));
  if (opts.q) filters.push(ilike(products.name, `%${opts.q}%`));

  let orderBy;
  switch (opts.sort) {
    case "price-asc":
      orderBy = sql`coalesce(${products.salePrice}, ${products.price}) asc`;
      break;
    case "price-desc":
      orderBy = sql`coalesce(${products.salePrice}, ${products.price}) desc`;
      break;
    case "rating":
      orderBy = desc(products.rating);
      break;
    default:
      orderBy = desc(products.featured);
  }

  const rows = await db
    .select()
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(orderBy, products.id);
  return joinRows(rows);
}

export async function getFeaturedProducts() {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.featured, true))
    .orderBy(products.id)
    .limit(8);
  return joinRows(rows);
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return joinRows(rows)[0] ?? null;
}

export async function getRelatedProducts(categoryId: number, excludeId: number) {
  const rows = await db
    .select()
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.categoryId, categoryId), sql`${products.id} <> ${excludeId}`))
    .limit(4);
  return joinRows(rows);
}

export function formatPrice(v: string | number) {
  return "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Lowest selling price (sale price, else cheapest variant, else base price). */
export function startingPrice(p: Product) {
  if (p.salePrice) return Number(p.salePrice);
  if (p.variants?.length) return Math.min(...p.variants.map((v) => v.price));
  return Number(p.price);
}
