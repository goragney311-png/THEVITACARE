"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-context";
import { CartDrawer } from "./cart-drawer";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=supplements", label: "Supplements" },
  { href: "/shop?category=skin-care", label: "Skin Care" },
  { href: "/shop?category=serum", label: "Serum" },
  { href: "/shop?category=sunscreens", label: "Sunscreens" },
  { href: "/shop?category=hair-care", label: "Hair Care" },
  { href: "/shop?category=lipsticks", label: "Lipsticks" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="bg-emerald-700 text-white text-xs sm:text-sm text-center py-2 px-4">
        🚚 Free shipping on orders over $150 &nbsp;|&nbsp; 🔒 Secure checkout with cards & PayPal &nbsp;|&nbsp; ✉️ order@thevitacare.com
      </div>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-16 sm:h-20 flex items-center gap-4">
          <button className="lg:hidden p-2" onClick={() => setMenu(!menu)} aria-label="Menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white font-black text-xl">V</span>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              THE<span className="text-emerald-600">VITA</span>CARE
            </span>
          </Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/shop?q=${encodeURIComponent(q)}`);
            }}
            className="hidden md:flex flex-1 max-w-xl mx-auto"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-l-full border border-r-0 border-slate-300 px-5 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <button className="rounded-r-full bg-emerald-600 px-5 text-white hover:bg-emerald-700">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" /><path d="M13 13l4 4" /></svg>
            </button>
          </form>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/track" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-emerald-600 px-3">
              Track Order
            </Link>
            <button onClick={() => setOpen(true)} className="relative p-2 rounded-full hover:bg-slate-100" aria-label="Cart">
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 3h2l2.4 12.4a1 1 0 001 .8h9.7a1 1 0 001-.8L21 7H6" /><circle cx="9" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        <nav className={`${menu ? "block" : "hidden"} lg:block border-t border-slate-100 bg-white`}>
          <ul className="mx-auto max-w-7xl px-4 flex flex-col lg:flex-row lg:items-center lg:justify-center gap-1 lg:gap-8 py-2 lg:py-0 text-sm font-semibold uppercase tracking-wide text-slate-700">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setMenu(false)} className="block py-2.5 lg:py-3 hover:text-emerald-600">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <CartDrawer />
    </>
  );
}
