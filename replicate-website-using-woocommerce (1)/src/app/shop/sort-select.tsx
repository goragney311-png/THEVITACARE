"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  return (
    <select
      value={current}
      onChange={(e) => {
        const u = new URLSearchParams(sp.toString());
        if (e.target.value) u.set("sort", e.target.value);
        else u.delete("sort");
        router.push(`/shop?${u.toString()}`);
      }}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
    >
      <option value="">Default sorting</option>
      <option value="rating">Sort by rating</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
  );
}
