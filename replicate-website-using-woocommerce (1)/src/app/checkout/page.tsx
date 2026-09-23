"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, usd, shippingFor } from "@/components/cart-context";

const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Other / International"];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const shipping = shippingFor(subtotal);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, paymentMethod: payment, items: items.map((i) => ({ id: i.id, variant: i.variant, quantity: i.quantity })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      clear();
      router.push(`/order-success?number=${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-slate-600">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-emerald-600 font-bold">Go to Shop →</Link>
      </div>
    );
  }

  const input = "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">Checkout</h1>
      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <div className="rounded-2xl border p-6">
            <h2 className="font-bold text-lg mb-4">Billing & Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="text-sm font-medium">Full Name *</label><input required className={input} value={form.name} onChange={set("name")} /></div>
              <div><label className="text-sm font-medium">Email *</label><input required type="email" className={input} value={form.email} onChange={set("email")} /></div>
              <div><label className="text-sm font-medium">Phone *</label><input required type="tel" title="Phone number with country code" className={input} value={form.phone} onChange={set("phone")} /></div>
              <div className="sm:col-span-2"><label className="text-sm font-medium">Street Address *</label><input required className={input} value={form.address} onChange={set("address")} placeholder="House no., Building, Street, Area" /></div>
              <div><label className="text-sm font-medium">City *</label><input required className={input} value={form.city} onChange={set("city")} /></div>
              <div>
                <label className="text-sm font-medium">State *</label>
                <select required className={input} value={form.state} onChange={set("state")}>
                  <option value="">Select state</option>
                  {states.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="text-sm font-medium">ZIP / Postal Code *</label><input required className={input} value={form.pincode} onChange={set("pincode")} /></div>
            </div>
          </div>
          <div className="rounded-2xl border p-6">
            <h2 className="font-bold text-lg mb-4">Payment Method</h2>
            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer has-checked:border-emerald-500 has-checked:bg-emerald-50">
              <input type="radio" name="pay" value="card" checked={payment === "card"} onChange={() => setPayment("card")} />
              <div><p className="font-semibold">Credit / Debit Card</p><p className="text-xs text-slate-500">Visa, Mastercard, Amex – demo mode, no real charge</p></div>
            </label>
            <label className="mt-3 flex items-center gap-3 rounded-lg border p-4 cursor-pointer has-checked:border-emerald-500 has-checked:bg-emerald-50">
              <input type="radio" name="pay" value="paypal" checked={payment === "paypal"} onChange={() => setPayment("paypal")} />
              <div><p className="font-semibold">PayPal</p><p className="text-xs text-slate-500">Demo mode – no real payment is charged</p></div>
            </label>
            <p className="mt-4 text-xs text-slate-500">🔒 Secure payment with end-to-end encryption. Orders are processed within 1–2 business days; delivery usually takes 16–20 business days.</p>
          </div>
        </div>
        <div className="rounded-2xl border p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Your Order</h2>
          <div className="space-y-3 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between gap-3">
                <span className="text-slate-700">{i.name}{i.variant && <span className="text-slate-500"> ({i.variant})</span>} <span className="text-slate-400">× {i.quantity}</span></span>
                <span className="font-semibold shrink-0">{usd(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{usd(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : usd(shipping)}</span></div>
            <div className="flex justify-between text-lg font-extrabold border-t pt-3"><span>Total</span><span>{usd(subtotal + shipping)}</span></div>
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="mt-5 w-full rounded-full bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
          <p className="mt-3 text-xs text-slate-500 text-center">🔒 Your information is safe and secure.</p>
        </div>
      </form>
    </div>
  );
}
