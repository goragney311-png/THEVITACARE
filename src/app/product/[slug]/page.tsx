import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, formatPrice, startingPrice } from "@/lib/data";
import { AddToCartButton } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { Stars } from "@/components/stars";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const related = await getRelatedProducts(p.categoryId, p.id);
  const price = startingPrice(p);
  const mrp = Number(p.price);
  const variants = p.variants ?? [];
  const hasRange = variants.length > 1;
  const maxPrice = hasRange ? Math.max(...variants.map((v) => v.price)) : mrp;
  const off = p.salePrice ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isRx = p.dosage?.includes("prescription medicine");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <p className="text-sm text-slate-500">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
        <Link href={`/shop?category=${p.category.slug}`}>{p.category.name}</Link> / <span className="text-slate-900">{p.name}</span>
      </p>

      <div className="mt-6 grid lg:grid-cols-2 gap-10">
        <div className="relative rounded-3xl border bg-slate-50 overflow-hidden">
          {off > 0 && <span className="absolute left-4 top-4 z-10 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-bold text-white">-{off}% OFF</span>}
          <Image src={p.image} alt={p.name} width={800} height={800} priority className="aspect-square w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">{p.category.name}{p.brand && <span className="text-slate-400 normal-case tracking-normal"> · Brand: {p.brand}</span>}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars value={Number(p.rating)} size={18} />
            <span className="font-semibold">{p.rating}</span>
            <span className="text-slate-500">({p.reviewCount} customer reviews)</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-emerald-700">{formatPrice(price)}{hasRange && <span className="text-2xl text-slate-500"> – {formatPrice(maxPrice)}</span>}</span>
            {p.salePrice && <span className="text-xl text-slate-400 line-through">{formatPrice(mrp)}</span>}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {p.sku && <span>SKU: {p.sku}</span>}
            <span>Category: {p.category.name}</span>
            <span className="text-emerald-600 font-semibold">{p.stock > 0 ? "In Stock" : "Out of Stock"}</span>
          </div>
          <p className="mt-5 text-slate-600 leading-relaxed">{p.shortDescription}</p>

          <ul className="mt-5 space-y-2">
            {p.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500 text-xs">Form</p><p className="font-bold">{p.form}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500 text-xs">Options</p><p className="font-bold">{variants.length ? variants.map((v) => v.label).join(" / ") : `${p.servings} ${p.form}`}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500 text-xs">Availability</p><p className="font-bold text-emerald-600">{p.stock > 0 ? "In Stock" : "Out of Stock"}</p></div>
          </div>

          {isRx && (
            <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
              <strong>Rx – Prescription medicine.</strong> Please consult a licensed healthcare professional before use. You may be asked to provide a valid prescription at checkout or before dispatch.
            </div>
          )}
          <AddToCartButton withQty className="mt-7" product={{ id: p.id, name: p.name, slug: p.slug, price, image: p.image, variants, salePrice: p.salePrice ? Number(p.salePrice) : null }} />

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
            <span>🔒 Secure Checkout</span><span>🚚 Free Shipping over $150</span><span>📦 Ships in 1–2 business days</span><span>💳 Cards & PayPal</span>
          </div>
        </div>
      </div>

      {/* Details tabs */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-extrabold">Description</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">{p.description}</p>
          <h3 className="mt-8 text-xl font-bold">Ingredients</h3>
          <p className="mt-2 text-slate-700 leading-relaxed">{p.ingredients}</p>
          <h3 className="mt-8 text-xl font-bold">{isRx ? "Dosage & Directions" : "How to Use"}</h3>
          <p className="mt-2 text-slate-700 leading-relaxed">{p.dosage}</p>
          <p className="mt-6 text-xs text-slate-500">
            * Not for medicinal use. Consult your healthcare professional before use if you are pregnant, nursing, taking medication or have a medical condition. Keep out of reach of children. Store in a cool, dry place.
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-6 h-fit">
          <h3 className="font-bold text-lg">Why THEVITACARE?</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>✅ Products sourced from verified suppliers & distributors</li>
            <li>✅ Secure payment with end-to-end encryption</li>
            <li>✅ Orders processed within 1–2 business days</li>
            <li>✅ Discreet packaging, tracked shipping to the USA</li>
            <li>✅ Responsive customer support – order@thevitacare.com</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
