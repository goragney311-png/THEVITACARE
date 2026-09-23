"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, usd } from "./cart-context";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">Shopping Cart</h2>
          <button onClick={() => setOpen(false)} className="text-2xl leading-none text-slate-500 hover:text-slate-900">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              <p className="text-5xl mb-3">🛒</p>
              <p>Your cart is empty.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="mt-4 inline-block text-emerald-600 font-semibold">
                Continue Shopping →
              </Link>
            </div>
          )}
          {items.map((i) => (
            <div key={i.key} className="flex gap-3">
              <Image src={i.image} alt={i.name} width={72} height={72} className="h-18 w-18 rounded-lg border object-cover" />
              <div className="flex-1">
                <Link href={`/product/${i.slug}`} onClick={() => setOpen(false)} className="text-sm font-semibold hover:text-emerald-600 line-clamp-2">
                  {i.name}
                </Link>
                {i.variant && <p className="text-xs text-slate-500">{i.variant}</p>}
                <p className="text-sm text-emerald-700 font-bold mt-0.5">{usd(i.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded border">
                    <button onClick={() => setQty(i.key, i.quantity - 1)} className="px-2.5 py-0.5 hover:bg-slate-100">−</button>
                    <span className="px-2 text-sm">{i.quantity}</span>
                    <button onClick={() => setQty(i.key, i.quantity + 1)} className="px-2.5 py-0.5 hover:bg-slate-100">+</button>
                  </div>
                  <button onClick={() => remove(i.key)} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{usd(subtotal)}</span>
            </div>
            <p className="text-xs text-slate-500">Shipping & taxes calculated at checkout.</p>
            <Link href="/cart" onClick={() => setOpen(false)} className="block w-full rounded-full border border-emerald-600 py-2.5 text-center font-semibold text-emerald-700 hover:bg-emerald-50">
              View Cart
            </Link>
            <Link href="/checkout" onClick={() => setOpen(false)} className="block w-full rounded-full bg-emerald-600 py-2.5 text-center font-semibold text-white hover:bg-emerald-700">
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
