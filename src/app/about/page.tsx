import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <div className="bg-emerald-50 py-14 text-center">
        <h1 className="text-4xl font-extrabold">About Us</h1>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto px-4">Welcome to THEVITACARE – an online store focused on beauty, skincare, and personal care products, serving customers across the United States.</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <Image src="/images/skincare-set.jpg" alt="THEVITACARE" width={700} height={700} className="rounded-3xl shadow-xl object-cover aspect-square" />
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold">Our Story</h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              THEVITACARE was created to make online shopping for skincare and personal care products easier and more accessible. Founded in 2024, our goal is to provide a simple, reliable, and convenient online shopping experience for everyday essentials.
            </p>
            <p className="mt-3 text-slate-700 leading-relaxed">
              We understand that customers value convenience, clear product information, and dependable service. Our platform is designed to bring together a curated selection of products in one place, allowing customers to browse and shop easily from the comfort of their homes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">What We Offer</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-slate-700 text-sm">
              <li>✅ Skincare products</li><li>✅ Lip care and sunscreens</li><li>✅ Beauty accessories</li><li>✅ Personal care essentials</li><li>✅ Hair care & colour</li><li>✅ Health supplements</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-extrabold">Supplier & Product Authenticity</h2>
            <p className="mt-3 text-slate-700 leading-relaxed text-sm">
              At THEVITACARE, we are committed to sourcing products responsibly and ensuring product authenticity. We work with established suppliers, distributors, and fulfillment partners based in India who operate in compliance with applicable local laws and industry standards. Products are sourced through legitimate wholesale and distribution channels and are handled according to standard storage and shipping practices.
            </p>
            <h3 className="mt-5 font-bold">What We Mean by “Verified Suppliers”</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>– Suppliers are evaluated based on their business registration and operational history</li>
              <li>– Products are sourced through recognized distribution networks</li>
              <li>– We aim to maintain consistency in product quality and fulfillment reliability</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Important Clarification</h2>
            <p className="mt-3 text-slate-700 leading-relaxed text-sm">
              THEVITACARE is an independent online retailer and is not the manufacturer of the products listed on our website. We do not claim direct affiliation with all brands featured unless explicitly stated. Due to supplier agreements and operational reasons, we do not publicly list individual supplier identities. However, we take reasonable steps to ensure that products supplied meet expected quality and authenticity standards.
            </p>
            <p className="mt-3 text-slate-700 text-sm">If you have questions about a specific product, feel free to contact our support team at <a className="text-emerald-600 font-semibold" href="mailto:order@thevitacare.com">order@thevitacare.com</a> before purchasing.</p>
            <h2 className="mt-8 text-2xl font-extrabold">Customer Commitment</h2>
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              <li>✅ Providing a convenient and secure online shopping platform</li>
              <li>✅ Offering carefully selected products</li>
              <li>✅ Maintaining transparent policies</li>
              <li>✅ Delivering responsive and helpful customer support</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center">Our Policies</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            ["🚚 Shipping", "Orders are processed within 1–2 business days. Delivery usually takes 16–20 business days depending on location and courier conditions. Free shipping on orders over $150; $15 flat rate otherwise."],
            ["↩️ Returns & Refunds", "If your order arrives damaged or incorrect, contact us within 7 days of delivery with photos and your order number at order@thevitacare.com. We'll arrange a replacement or refund."],
            ["🔒 Privacy", "We respect your privacy. Your personal information is used only to process and deliver your order and is never sold to third parties."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border p-6"><h3 className="font-bold text-lg">{t}</h3><p className="mt-2 text-sm text-slate-600 leading-relaxed">{d}</p></div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-emerald-50 p-6 text-sm text-slate-700">
          <p><strong>Website Name:</strong> TheVitaCare.com &nbsp;|&nbsp; <strong>Company Name:</strong> THEVITACARE &nbsp;|&nbsp; <strong>Registration Number:</strong> UDYAM-GJ-22-0600303</p>
          <p className="mt-1"><strong>Address:</strong> 577 Gadhpur Township, Pasodara Kathodara, Surat, Gujarat, 394326, India &nbsp;|&nbsp; <strong>Email:</strong> order@thevitacare.com &nbsp;|&nbsp; <strong>Phone:</strong> +91 7069698484</p>
        </div>
        <div className="text-center mt-12">
          <Link href="/shop" className="rounded-full bg-emerald-600 px-8 py-3 font-bold text-white">Explore Products</Link>
        </div>
      </div>
    </div>
  );
}
