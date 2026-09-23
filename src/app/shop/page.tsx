import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { SortSelect } from "./sort-select";

export const dynamic = "force-dynamic";

type SP = Promise<{ category?: string; q?: string; sort?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const [cats, list] = await Promise.all([getCategories(), getProducts(sp)]);
  const activeCat = cats.find((c) => c.slug === sp.category);

  const linkFor = (cat?: string) => {
    const u = new URLSearchParams();
    if (cat) u.set("category", cat);
    if (sp.q) u.set("q", sp.q);
    if (sp.sort) u.set("sort", sp.sort);
    return `/shop${u.toString() ? "?" + u.toString() : ""}`;
  };

  return (
    <div>
      <div className="bg-emerald-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm text-slate-500"><Link href="/">Home</Link> / Shop{activeCat && ` / ${activeCat.name}`}</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">{activeCat?.name ?? (sp.q ? `Results for "${sp.q}"` : "All Products")}</h1>
          {activeCat?.description && <p className="mt-2 text-slate-600">{activeCat.description}</p>}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 mt-8 grid lg:grid-cols-[240px_1fr] gap-8">
        <aside>
          <h3 className="font-bold mb-3">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href={linkFor()} className={`block rounded-lg px-3 py-2 hover:bg-emerald-50 ${!sp.category ? "bg-emerald-100 font-semibold text-emerald-800" : ""}`}>All Products</Link>
            </li>
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={linkFor(c.slug)} className={`block rounded-lg px-3 py-2 hover:bg-emerald-50 ${sp.category === c.slug ? "bg-emerald-100 font-semibold text-emerald-800" : ""}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white">
            <p className="font-bold text-lg">Free Shipping</p>
            <p className="text-sm opacity-90 mt-1">On all orders over $150. Secure checkout with cards & PayPal.</p>
          </div>
        </aside>
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">Showing {list.length} product{list.length !== 1 && "s"}</p>
            <SortSelect current={sp.sort ?? ""} />
          </div>
          {list.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <p className="text-5xl">🔍</p>
              <p className="mt-3">No products found.</p>
              <Link href="/shop" className="mt-3 inline-block text-emerald-600 font-semibold">Clear filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {list.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
