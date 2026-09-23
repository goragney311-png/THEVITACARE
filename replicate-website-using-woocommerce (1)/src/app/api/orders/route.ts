import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const FREE_SHIPPING_MIN = 150;
const SHIPPING_FEE = 15;

type Body = {
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string };
  paymentMethod: string;
  items: { id: number; variant?: string | null; quantity: number }[];
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const { customer, items, paymentMethod } = body;

  if (!items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  for (const k of ["name", "email", "phone", "address", "city", "state", "pincode"] as const) {
    if (!customer?.[k]?.trim()) return NextResponse.json({ error: `${k} is required` }, { status: 400 });
  }

  const dbProducts = await db.select().from(products).where(inArray(products.id, items.map((i) => i.id)));
  const map = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const lines: { productId: number; productName: string; variant: string | null; price: string; quantity: number }[] = [];
  for (const i of items) {
    const p = map.get(i.id);
    if (!p) return NextResponse.json({ error: "Invalid product in cart" }, { status: 400 });
    const variants = p.variants ?? [];
    let price: number;
    let variantLabel: string | null = null;
    if (variants.length) {
      const v = variants.find((x) => x.label === i.variant) ?? variants[0];
      variantLabel = v.label;
      price = p.salePrice && variants.length === 1 ? Number(p.salePrice) : v.price;
    } else {
      price = Number(p.salePrice ?? p.price);
    }
    const qty = Math.max(1, Math.min(20, Number(i.quantity) || 1));
    subtotal += price * qty;
    lines.push({ productId: p.id, productName: p.name, variant: variantLabel, price: price.toFixed(2), quantity: qty });
  }
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const orderNumber = "TVC" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
  const pm = ["card", "paypal", "cod", "online"].includes(paymentMethod) ? paymentMethod : "card";

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      paymentMethod: pm,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
    })
    .returning();

  await db.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));

  return NextResponse.json({ orderNumber: order.orderNumber, total });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number")?.trim();
  if (!number) return NextResponse.json({ error: "Order number required" }, { status: 400 });
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, number.toUpperCase())).limit(1);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return NextResponse.json({ order, items });
}
