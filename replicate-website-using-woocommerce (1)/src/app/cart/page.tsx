"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, usd, shippingFor, FREE_SHIPPING_MIN } from "@/components/cart-context";

export default function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const shipping = shippingFor(subtotal);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <p className="text-6xl">🛒</p>
          <p className="mt-4 text-lg">Your cart is currently empty.</p>
          <Link href="/shop" className="mt-6 inline-block rounded-full bg-emerald-600 px-8 py-3 font-bold text-white">Return to Shop</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="divide-y rounded-2xl border">
            {items.map((i) => (
              <div key={i.key} className="flex gap-4 p-4">
                <Image src={i.image} alt={i.name} width={96} height={96} className="h-24 w-24 rounded-xl border object-cover" />
                <div className="flex-1">
                  <Link href={`/product/${i.slug}`} className="font-semibold hover:text-emerald-600">{i.name}</Link>
                  <p className="text-sm text-slate-500 mt-1">{i.variant && <span>{i.variant} · </span>}{usd(i.price)} each</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center rounded-full border">
                      <button onClick={() => setQty(i.key, i.quantity - 1)} className="px-3 py-1 hover:bg-slate-100 rounded-l-full">−</button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => setQty(i.key, i.quantity + 1)} className="px-3 py-1 hover:bg-slate-100 rounded-r-full">+</button>
                    </div>
                    <button onClick={() => remove(i.key)} className="text-sm text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
                <p className="font-bold">{usd(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border p-6 h-fit space-y-3">
            <h2 className="font-bold text-lg">Cart Totals</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{usd(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : usd(shipping)}</span></div>
            {shipping > 0 && <p className="text-xs text-orange-600">Add {usd(FREE_SHIPPING_MIN - subtotal)} more for free shipping!</p>}
            <div className="flex justify-between font-extrabold text-lg border-t pt-3"><span>Total</span><span>{usd(subtotal + shipping)}</span></div>
            <Link href="/checkout" className="block rounded-full bg-emerald-600 py-3 text-center font-bold text-white hover:bg-emerald-700">Proceed to Checkout</Link>
            <Link href="/shop" className="block text-center text-sm text-emerald-600 font-semibold">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
