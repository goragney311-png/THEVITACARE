import Link from "next/link";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ number?: string }> }) {
  const { number } = await searchParams;
  const [order] = number ? await db.select().from(orders).where(eq(orders.orderNumber, number)).limit(1) : [];
  const items = order ? await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)) : [];

  if (!order) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-600">Order not found.</p>
        <Link href="/shop" className="mt-4 inline-block text-emerald-600 font-bold">Continue Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-4xl">✅</div>
        <h1 className="mt-5 text-3xl font-extrabold">Thank you, {order.customerName.split(" ")[0]}!</h1>
        <p className="mt-2 text-slate-600">Your order has been placed successfully. A confirmation has been sent to {order.email}. Orders are processed within 1–2 business days; delivery usually takes 16–20 business days.</p>
        <p className="mt-4 inline-block rounded-full bg-slate-100 px-5 py-2 font-mono font-bold">Order #{order.orderNumber}</p>
      </div>
      <div className="mt-10 rounded-2xl border p-6">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between"><span>{i.productName}{i.variant && <span className="text-slate-500"> ({i.variant})</span>} × {i.quantity}</span><span>{formatPrice(Number(i.price) * i.quantity)}</span></div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{Number(order.shipping) === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between text-lg font-extrabold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div><p className="font-bold">Shipping To</p><p className="text-slate-600">{order.address}, {order.city}, {order.state} – {order.pincode}</p><p className="text-slate-600">📞 {order.phone}</p></div>
          <div><p className="font-bold">Payment</p><p className="text-slate-600 capitalize">{order.paymentMethod === "card" ? "Credit / Debit Card" : order.paymentMethod} (demo)</p><p className="font-bold mt-2">Status</p><p className="capitalize text-emerald-600 font-semibold">{order.status}</p></div>
        </div>
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <Link href={`/track?number=${order.orderNumber}`} className="rounded-full border-2 border-emerald-600 px-6 py-2.5 font-bold text-emerald-700">Track Order</Link>
        <Link href="/shop" className="rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white">Continue Shopping</Link>
      </div>
    </div>
  );
}
