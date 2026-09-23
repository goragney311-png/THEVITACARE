import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * One-click production setup: creates tables if missing and seeds the catalog.
 * Visit /api/setup once after deploying (e.g. https://your-site.vercel.app/api/setup).
 */
export async function GET() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id serial PRIMARY KEY,
        name text NOT NULL,
        slug text NOT NULL UNIQUE,
        description text,
        image text
      );
      CREATE TABLE IF NOT EXISTS products (
        id serial PRIMARY KEY,
        name text NOT NULL,
        slug text NOT NULL UNIQUE,
        category_id integer NOT NULL REFERENCES categories(id),
        short_description text NOT NULL,
        description text NOT NULL,
        benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
        variants jsonb NOT NULL DEFAULT '[]'::jsonb,
        brand text,
        sku text,
        ingredients text,
        dosage text,
        price numeric(10,2) NOT NULL,
        sale_price numeric(10,2),
        image text NOT NULL,
        stock integer NOT NULL DEFAULT 100,
        rating numeric(2,1) NOT NULL DEFAULT 4.5,
        review_count integer NOT NULL DEFAULT 0,
        featured boolean NOT NULL DEFAULT false,
        form text NOT NULL DEFAULT 'Capsules',
        servings integer NOT NULL DEFAULT 60,
        created_at timestamp NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS orders (
        id serial PRIMARY KEY,
        order_number text NOT NULL UNIQUE,
        customer_name text NOT NULL,
        email text NOT NULL,
        phone text NOT NULL,
        address text NOT NULL,
        city text NOT NULL,
        state text NOT NULL,
        pincode text NOT NULL,
        payment_method text NOT NULL DEFAULT 'cod',
        subtotal numeric(10,2) NOT NULL,
        shipping numeric(10,2) NOT NULL,
        total numeric(10,2) NOT NULL,
        status text NOT NULL DEFAULT 'processing',
        created_at timestamp NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id serial PRIMARY KEY,
        order_id integer NOT NULL REFERENCES orders(id),
        product_id integer NOT NULL REFERENCES products(id),
        product_name text NOT NULL,
        variant text,
        price numeric(10,2) NOT NULL,
        quantity integer NOT NULL
      );
    `);
    await ensureSeeded();
    const [{ count }] = (await db.execute(sql`select count(*)::int as count from products`)).rows as { count: number }[];
    return NextResponse.json({ ok: true, message: "Database ready", products: count });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
