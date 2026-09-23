import Link from "next/link";
import Image from "next/image";
import type { ProductWithCategory } from "@/lib/data";
import { formatPrice, startingPrice } from "@/lib/data";
import { AddToCartButton } from "./add-to-cart";
import { Stars } from "./stars";

export function ProductCard({ p }: { p: ProductWithCategory }) {
  const price = startingPrice(p);
  const mrp = Number(p.price);
  const variants = p.variants ?? [];
  const hasRange = variants.length > 1;
  const maxPrice = hasRange ? Math.max(...variants.map((v) => v.price)) : mrp;
  const off = p.salePrice ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-3 transition hover:shadow-xl hover:-translate-y-0.5">
      <Link href={`/product/${p.slug}`} className="relative block overflow-hidden rounded-xl bg-slate-50">
        {off > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">-{off}%</span>
        )}
        <Image
          src={p.image}
          alt={p.name}
          width={400}
          height={400}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">{p.category.name}</p>
        <Link href={`/product/${p.slug}`} className="mt-1 font-semibold text-slate-900 leading-snug hover:text-emerald-700 line-clamp-2">
          {p.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Stars value={Number(p.rating)} />
          <span>({p.reviewCount})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-extrabold text-slate-900">
            {formatPrice(price)}
            {hasRange && <span className="text-sm font-semibold text-slate-500"> – {formatPrice(maxPrice)}</span>}
          </span>
          {p.salePrice && <span className="text-sm text-slate-400 line-through">{formatPrice(mrp)}</span>}
        </div>
        <div className="mt-auto pt-3">
          {hasRange ? (
            <Link href={`/product/${p.slug}`} className="block w-full rounded-full border-2 border-emerald-600 py-2 text-center text-sm font-bold text-emerald-700 hover:bg-emerald-50">
              Select Options
            </Link>
          ) : (
            <AddToCartButton
              product={{ id: p.id, name: p.name, slug: p.slug, price, image: p.image, variants, salePrice: p.salePrice ? Number(p.salePrice) : null }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
