"use client";

import { useState } from "react";
import { useCart, usd } from "./cart-context";

type Variant = { label: string; price: number };
type P = { id: number; name: string; slug: string; price: number; image: string; variants?: Variant[]; salePrice?: number | null };

export function AddToCartButton({ product, withQty = false, className = "" }: { product: P; withQty?: boolean; className?: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const variants = product.variants ?? [];
  const [vIdx, setVIdx] = useState(0);
  const selected = variants[vIdx];
  const price = selected ? (product.salePrice && variants.length === 1 ? product.salePrice : selected.price) : product.price;

  return (
    <div className={className}>
      {withQty && variants.length > 1 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Select option</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setVIdx(i)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${i === vIdx ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 hover:border-emerald-500"}`}
              >
                {v.label} · {usd(v.price)}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        {withQty && (
          <div className="flex items-center rounded-full border border-slate-300">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 text-lg hover:bg-slate-100 rounded-l-full">−</button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button type="button" onClick={() => setQty(qty + 1)} className="px-4 py-2.5 text-lg hover:bg-slate-100 rounded-r-full">+</button>
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            add(
              { id: product.id, name: product.name, slug: product.slug, image: product.image, variant: selected?.label ?? null, price },
              qty,
            )
          }
          className="flex-1 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-95"
        >
          {withQty ? `Add to Cart – ${usd(price * qty)}` : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
