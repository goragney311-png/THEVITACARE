import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white font-black text-xl">V</span>
            <span className="text-2xl font-extrabold text-white">THE<span className="text-emerald-400">VITA</span>CARE</span>
          </div>
          <p className="text-sm leading-relaxed">
            THEVITACARE is an online destination for healthcare and skincare products, offering a curated selection of brands to customers across the United States. We source products through third-party distributors, suppliers and fulfillment partners.
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            {["Facebook", "Instagram", "YouTube"].map((s) => (
              <span key={s} className="rounded-full border border-slate-700 px-3 py-1 hover:border-emerald-400 hover:text-emerald-400 cursor-pointer">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop?category=supplements" className="hover:text-emerald-400">Supplements</Link></li>
            <li><Link href="/shop?category=skin-care" className="hover:text-emerald-400">Skin Care</Link></li>
            <li><Link href="/shop?category=serum" className="hover:text-emerald-400">Serum</Link></li>
            <li><Link href="/shop?category=sunscreens" className="hover:text-emerald-400">Sunscreens</Link></li>
            <li><Link href="/shop?category=eye-cream" className="hover:text-emerald-400">Eye Cream</Link></li>
            <li><Link href="/shop?category=face-wash" className="hover:text-emerald-400">Face Wash</Link></li>
            <li><Link href="/shop?category=hair-care" className="hover:text-emerald-400">Hair Care</Link></li>
            <li><Link href="/shop?category=lipsticks" className="hover:text-emerald-400">Lipsticks</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/track" className="hover:text-emerald-400">Track Your Order</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-400">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400">Shipping & Returns</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Get in Touch</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 577 Gadhpur Township, Pasodara Kathodara, Surat, Gujarat 394326, India</li>
            <li>📞 +91 7069698484</li>
            <li>✉️ order@thevitacare.com</li>
            <li>🕒 Mon–Sat: 9:00 AM – 6:00 PM IST</li>
            <li className="text-xs text-slate-500 pt-2">Registration No. UDYAM-GJ-22-0600303</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} THEVITACARE. All rights reserved. TheVitaCare is an India-registered online retailer operated by THEVITACARE. We are an independent retailer and not the manufacturer of listed products. Information on this site is not medical advice – consult a healthcare professional before using any medicine.
      </div>
    </footer>
  );
}
