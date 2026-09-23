"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usd } from "@/components/cart-context";

type Result = {
  order: { orderNumber: string; customerName: string; status: string; total: string; city: string; state: string; createdAt: string; paymentMethod: string };
  items: { id: number; productName: string; variant: string | null; quantity: number; price: string }[];
};

const steps = ["processing", "packed", "shipped", "delivered"];

function Tracker() {
  const sp = useSearchParams();
  const [number, setNumber] = useState(sp.get("number") ?? "");
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(n: string) {
    if (!n) return;
    setLoading(true);
    setError("");
    setData(null);
    const res = await fetch(`/api/orders?number=${encodeURIComponent(n)}`);
    const j = await res.json();
    if (!res.ok) setError(j.error);
    else setData(j);
    setLoading(false);
  }

  useEffect(() => {
    const n = sp.get("number");
    if (n) lookup(n);
  }, [sp]);

  const stepIdx = data ? steps.indexOf(data.order.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-center">Track Your Order</h1>
      <p className="mt-2 text-center text-slate-600">Enter your order number (e.g. TVC12345678XX) to see its status.</p>
      <form onSubmit={(e) => { e.preventDefault(); lookup(number); }} className="mt-6 flex">
        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Order number" className="flex-1 rounded-l-full border border-r-0 px-5 py-3 outline-none focus:border-emerald-500" />
        <button className="rounded-r-full bg-emerald-600 px-6 font-bold text-white">{loading ? "..." : "Track"}</button>
      </form>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>}
      {data && (
        <div className="mt-8 rounded-2xl border p-6">
          <div className="flex justify-between items-start">
            <div><p className="text-xs text-slate-500">Order</p><p className="font-mono font-bold">#{data.order.orderNumber}</p></div>
            <div className="text-right"><p className="text-xs text-slate-500">Placed on</p><p className="font-semibold">{new Date(data.order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p></div>
          </div>
          <div className="mt-8 flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200" />
            <div className="absolute top-4 left-0 h-1 bg-emerald-500 transition-all" style={{ width: `${(Math.max(stepIdx, 0) / (steps.length - 1)) * 100}%` }} />
            {steps.map((s, i) => (
              <div key={s} className="relative z-10 text-center">
                <div className={`mx-auto grid h-9 w-9 place-items-center rounded-full border-4 border-white text-xs font-bold ${i <= stepIdx ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</div>
                <p className="mt-2 text-xs capitalize font-semibold">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-sm border-t pt-4">
            {data.items.map((i) => (
              <div key={i.id} className="flex justify-between"><span>{i.productName}{i.variant && <span className="text-slate-500"> ({i.variant})</span>} × {i.quantity}</span><span>{usd(Number(i.price) * i.quantity)}</span></div>
            ))}
            <div className="flex justify-between font-extrabold text-base border-t pt-3"><span>Total</span><span>{usd(Number(data.order.total))}</span></div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Shipping to {data.order.customerName}, {data.order.city}, {data.order.state} · Payment: {data.order.paymentMethod}</p>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <Tracker />
    </Suspense>
  );
}
