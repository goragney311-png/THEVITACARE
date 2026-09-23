import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

const features = [
  { icon: "🔒", title: "Secure Payment", text: "End-to-end encryption. Credit/debit cards and PayPal accepted." },
  { icon: "✅", title: "Verified Suppliers", text: "Products sourced through recognised distribution networks." },
  { icon: "📦", title: "Fast Processing", text: "Orders processed within 1–2 business days." },
  { icon: "🚚", title: "Tracked Shipping", text: "Delivery in 16–20 business days. Free shipping over $150." },
];

const faqs = [
  { q: "What products does TheVitaCare offer?", a: "TheVitaCare offers high-quality skincare products focused on hydration, anti-aging and acne care, along with supplements, hair care, lip care and beauty accessories." },
  { q: "How do I place an order?", a: "Select your product, click “Add to Cart,” and proceed to our secure checkout. You'll receive an order number to track your shipment." },
  { q: "How long does delivery take?", a: "Orders are processed within 1–2 business days. Delivery usually takes 16–20 business days depending on location and courier conditions." },
  { q: "Are your products authentic?", a: "We work with established suppliers, distributors and fulfillment partners based in India who operate in compliance with applicable laws. Products are sourced through legitimate wholesale channels." },
  { q: "Do I need a prescription?", a: "Some items in our Supplements category are prescription medicines. Please consult a licensed healthcare professional before use; we may request a valid prescription before dispatch." },
];

export default async function Home() {
  const [cats, featured, all] = await Promise.all([getCategories(), getFeaturedProducts(), getProducts({ sort: "rating" })]);
  const trending = all.filter((p) => p.category.slug === "supplements").slice(0, 8);
  const catCounts = new Map<string, number>();
  for (const p of all) catCounts.set(p.category.slug, (catCounts.get(p.category.slug) ?? 0) + 1);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 items-center gap-8 py-14 lg:py-20">
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-600">
              🇺🇸 Shipping across the United States
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
              Your Online Destination for <span className="text-emerald-600">Healthcare</span> & Skincare
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-lg">
              A curated selection of supplements, skincare, serums, sunscreens and personal care essentials – sourced from verified suppliers and delivered to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="rounded-full bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700">
                Shop Now
              </Link>
              <Link href="/shop?category=supplements" className="rounded-full border-2 border-slate-900 px-8 py-3.5 font-bold text-slate-900 hover:bg-slate-900 hover:text-white">
                Browse Supplements
              </Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm">
              <div><p className="text-2xl font-extrabold">{all.length}+</p><p className="text-slate-500">Products</p></div>
              <div><p className="text-2xl font-extrabold">{cats.length}</p><p className="text-slate-500">Categories</p></div>
              <div><p className="text-2xl font-extrabold">4.7★</p><p className="text-slate-500">Average Rating</p></div>
            </div>
          </div>
          <div className="relative">
            <Image src="/images/hero.jpg" alt="The Vita Care products" width={800} height={600} priority className="rounded-3xl shadow-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 -mt-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
          {features.map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="text-3xl">{f.icon}</span>
              <div>
                <p className="font-bold">{f.title}</p>
                <p className="text-sm text-slate-500">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Selling / Weekly featured */}
      <section className="mx-auto max-w-7xl px-4 mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Best Selling Products</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Weekly Featured Products</h2>
          </div>
          <Link href="/shop" className="font-semibold text-emerald-600 hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 mt-20">
        <div className="rounded-3xl bg-slate-900 text-slate-200 p-8 sm:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">About THEVITACARE</p>
            <h2 className="text-3xl font-extrabold text-white mt-2">Curated healthcare & skincare, delivered</h2>
            <p className="mt-4 leading-relaxed">
              THEVITACARE is an online destination for healthcare and skincare products, offering a curated selection of brands to customers across the United States. We source products through third-party distributors, suppliers and fulfillment partners to provide a range of skincare, wellness and personal care products.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              THEVITACARE operates as an independent online retailer and marketplace and does not manufacture or develop products. All items available on our website are sourced from third-party brands and suppliers.
            </p>
            <Link href="/about" className="mt-6 inline-block rounded-full bg-emerald-500 px-6 py-2.5 font-bold text-white hover:bg-emerald-600">Read Our Story</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[["1–2", "Days processing"], ["16–20", "Days delivery"], ["$150+", "Free shipping"], ["24h", "Support response"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/5 p-6"><p className="text-3xl font-extrabold text-white">{n}</p><p className="text-sm text-slate-400 mt-1">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 mt-20">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Browse our categories</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className="group rounded-2xl border border-slate-200 p-3 text-center hover:shadow-lg transition">
              <div className="overflow-hidden rounded-xl aspect-square">
                <Image src={c.image ?? "/images/hero.jpg"} alt={c.name} width={300} height={300} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <p className="mt-3 text-sm font-bold group-hover:text-emerald-600">{c.name}</p>
              <p className="text-xs text-slate-500">{catCounts.get(c.slug) ?? 0} Product{(catCounts.get(c.slug) ?? 0) !== 1 && "s"}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="bg-slate-50 mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Trending This Week</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Top Trending Collections</h2>
            <p className="mt-3 text-slate-600">Discover this week&apos;s top trending collections that everyone is raving about! From must-have skincare essentials to the latest in nutrition, explore what&apos;s making waves in the beauty and wellness world.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 mt-20">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Help</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-slate-200 p-5 open:bg-emerald-50/40">
              <summary className="cursor-pointer list-none font-bold flex justify-between items-center">
                {f.q}
                <span className="text-emerald-600 group-open:rotate-45 transition text-2xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-4xl px-4 mt-20 text-center">
        <h2 className="text-3xl font-extrabold">Stay in the loop</h2>
        <p className="mt-3 text-slate-600">Get wellness tips and exclusive offers straight to your inbox.</p>
        <form className="mt-6 flex max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 rounded-l-full border border-r-0 px-5 py-3 outline-none focus:border-emerald-500" />
          <button type="button" className="rounded-r-full bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700">Subscribe</button>
        </form>
      </section>
    </div>
  );
}
