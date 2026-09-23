# THEVITACARE – Online Store (Next.js + PostgreSQL)

Clone of thevitacare.com built with Next.js 16 (App Router), Tailwind CSS, Drizzle ORM and PostgreSQL.
Features: product catalog with pack-size variants, cart, checkout, orders saved in DB, order tracking, about/contact.

---

## ⚠️ Preview link expire kyun hota hai?

Development sandbox ka link (`https://3000-xxxx.e2b.app`) **temporary** hota hai – idle hone par sandbox band ho jaata hai
aur "Sandbox Not Found" aata hai. Website ko **24×7 permanent** rakhne ke liye ise real hosting par deploy karein (free hai, ~10 minute).

---

## 🚀 Permanent Deployment (FREE) – Vercel + Neon

### Step 1 – Free PostgreSQL database (Neon)
1. https://neon.tech par jaayein → **Sign up** (GitHub/Google se)
2. **New Project** → naam dein (e.g. `thevitacare`) → Create
3. Dashboard par **Connection string** copy karein. Yeh aisa dikhega:
   `postgresql://user:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require`

### Step 2 – Code ko GitHub par daalein
1. https://github.com/new → repository banayein (e.g. `thevitacare`) → Create
2. Is project ka **poora folder** (node_modules aur .next ke bina) upload karein:
   - GitHub page par **"uploading an existing file"** link se drag-and-drop karein, **ya**
   - Terminal se:
     ```bash
     git init
     git add .
     git commit -m "THEVITACARE store"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/thevitacare.git
     git push -u origin main
     ```

### Step 3 – Vercel par deploy
1. https://vercel.com → **Sign up with GitHub**
2. **Add New → Project** → apni `thevitacare` repository **Import** karein
3. **Environment Variables** section me add karein:
   - Name: `DATABASE_URL`
   - Value: *(Step 1 ki Neon connection string)*
4. **Deploy** dabayein → 2–3 minute me build ho jaayega
5. Aapko permanent URL milega: **`https://thevitacare-xxxx.vercel.app`**

### Step 4 – Database setup (sirf ek baar)
Browser me kholein:
```
https://thevitacare-xxxx.vercel.app/api/setup
```
Yeh tables bana dega aur saare 33 products + categories seed kar dega. Response: `{"ok":true,"products":33}`

✅ Done! Ab website hamesha online rahegi.

### (Optional) Apna domain lagayein
Vercel → Project → **Settings → Domains** → `thevitacare-clone.com` add karein → DNS me diya gaya CNAME set karein.

---

## 💻 Local development

```bash
cp .env.example .env        # DATABASE_URL set karein
npm install
npx drizzle-kit push        # tables banayein
npm run dev                 # http://localhost:3000
```

## 📁 Structure

| Path | Kya hai |
|---|---|
| `src/db/schema.ts` | Tables: categories, products, orders, order_items |
| `src/db/seed-data.ts` | **Products, prices, descriptions, images** – yahin edit karein |
| `src/lib/data.ts` | DB queries + auto-seed |
| `src/app/page.tsx` | Home page |
| `src/app/shop` | Shop page (filters, sort, search) |
| `src/app/product/[slug]` | Product detail page |
| `src/app/cart`, `checkout`, `order-success`, `track` | Cart → order flow |
| `src/app/api/orders` | Order create / lookup API |
| `src/app/api/setup` | One-click production DB setup |
| `public/images/` | Product images |

## ✏️ Products kaise badlein
`src/db/seed-data.ts` me edit karein, phir naye DB par `/api/setup` kholein.
Agar DB me pehle se data hai to pehle reset karein:
```sql
truncate order_items, orders, products, categories restart identity cascade;
```
