"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const input = "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500";
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl font-extrabold">Contact Us</h1>
        <p className="mt-3 text-slate-600">Have a question about our products or your order? We&apos;d love to hear from you.</p>
        <ul className="mt-8 space-y-4 text-slate-700">
          <li className="flex gap-3"><span className="text-2xl">📍</span><span>THEVITACARE<br />577 Gadhpur Township, Pasodara Kathodara,<br />Surat, Gujarat 394326, India</span></li>
          <li className="flex gap-3"><span className="text-2xl">📞</span><span>+91 7069698484</span></li>
          <li className="flex gap-3"><span className="text-2xl">✉️</span><span>order@thevitacare.com</span></li>
          <li className="flex gap-3"><span className="text-2xl">🕒</span><span>Customer Service: Mon–Sat, 9:00 AM – 6:00 PM IST</span></li>
          <li className="flex gap-3"><span className="text-2xl">🏢</span><span>Registration No. UDYAM-GJ-22-0600303</span></li>
        </ul>
      </div>
      <div className="rounded-2xl border p-6">
        {sent ? (
          <div className="py-16 text-center">
            <p className="text-5xl">💌</p>
            <p className="mt-4 font-bold text-lg">Message sent!</p>
            <p className="text-slate-600 text-sm">We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <div><label className="text-sm font-medium">Name</label><input required className={input} /></div>
            <div><label className="text-sm font-medium">Email</label><input required type="email" className={input} /></div>
            <div><label className="text-sm font-medium">Subject</label><input required className={input} /></div>
            <div><label className="text-sm font-medium">Message</label><textarea required rows={5} className={input} /></div>
            <button className="w-full rounded-full bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
