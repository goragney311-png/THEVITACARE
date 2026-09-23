# THEVITACARE – Magento 2 Theme Package

Yeh folder aapki Next.js website ka **Magento 2 version** hai — same design (emerald branding, rounded cards,
top bar, 4-column footer, home page sections, product page trust badges, Rx notice) aur same **33 products / 11 categories**.

Compatible: **Magento Open Source / Adobe Commerce 2.4.x** (PHP 8.1–8.3). Theme Luma ka child theme hai.

```
magento-theme/
├── app/design/frontend/TheVitaCare/default/   ← THEME (Luma child)
│   ├── registration.php, theme.xml, composer.json, etc/view.xml
│   ├── web/css/source/_theme.less             ← colours, fonts, buttons (Luma variables)
│   ├── web/css/source/_extend.less            ← custom sections (hero, cards, footer, FAQ…)
│   ├── web/images/logo.svg, hero.jpg
│   ├── Magento_Theme/layout/default.xml       ← top bar, logo, footer
│   ├── Magento_Theme/templates/html/topbar.phtml, footer.phtml
│   ├── Magento_Catalog/layout/catalog_product_view.xml, catalog_category_view.xml
│   ├── Magento_Catalog/templates/product/view/trust.phtml, rx-notice.phtml, why.phtml
│   └── Magento_Cms/layout/cms_index_index.xml
├── app/code/TheVitaCare/Setup/                ← MODULE: auto-creates attributes, categories, CMS pages
│   └── Setup/Patch/Data/AddProductAttributes.php, CreateCategories.php, CreateCmsPages.php
└── import/
    ├── products.csv                           ← 33 products (System > Import)
    └── images/*.jpg                           ← product + category images
```

---

## Installation (step-by-step)

### 1. Files copy karein
Apne Magento root (jahan `bin/magento` hai) me:
```bash
cp -r magento-theme/app/design/frontend/TheVitaCare  <MAGENTO_ROOT>/app/design/frontend/
cp -r magento-theme/app/code/TheVitaCare             <MAGENTO_ROOT>/app/code/
```

### 2. Images copy karein
```bash
# product images (import ke liye)
mkdir -p <MAGENTO_ROOT>/var/import/images
cp magento-theme/import/images/*.jpg <MAGENTO_ROOT>/var/import/images/

# category images (home page "Shop by Category" ke liye)
mkdir -p <MAGENTO_ROOT>/pub/media/catalog/category
cp magento-theme/import/images/*.jpg <MAGENTO_ROOT>/pub/media/catalog/category/
```

### 3. Module + theme enable karein
```bash
cd <MAGENTO_ROOT>
bin/magento module:enable TheVitaCare_Setup
bin/magento setup:upgrade            # attributes, 11 categories, CMS pages (home/about/shipping) ban jaayenge
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f en_US
bin/magento cache:flush
```

### 4. Theme apply karein
Admin → **Content → Design → Configuration** → apne Store View ki row me **Edit** →
**Applied Theme = THEVITACARE** → Save.

### 5. Products import karein
Admin → **System → Data Transfer → Import**
- Entity Type: **Products**
- Import Behavior: **Add/Update**
- Images File Directory: `var/import/images`
- Select File: `magento-theme/import/products.csv`
- **Check Data** → **Import**

Phir:
```bash
bin/magento indexer:reindex
bin/magento cache:flush
```

### 6. Shipping / Payment (original site jaisa)
- **Stores → Configuration → Sales → Shipping Methods → Free Shipping**: Enabled, Minimum Order Amount = `150`
- **Flat Rate**: Enabled, Price = `15`
- **Sales → Payment Methods**: PayPal Express + card gateway (Stripe/Braintree) enable karein
- **General → Currency Setup**: Base currency **USD**

---

## Products / content kaise badlein
- Products: Admin → Catalog → Products (ya `import/products.csv` edit karke re-import)
- Home page: Admin → Content → Pages → **Home – THEVITACARE** (`tvc-home`)
- Colours/fonts: `web/css/source/_theme.less` → phir `setup:static-content:deploy -f`
- Footer text/links: `Magento_Theme/templates/html/footer.phtml`

## Notes
- Pack-size variants (30 / 100 Tablets) **custom options** ke roop me import hote hain; base price = sabse chhota pack,
  bade packs pe fixed surcharge. Agar aap alag SKU/stock per pack chahte hain to configurable products banayein.
- Prescription products pe **Rx notice** tab dikhta hai jab product ke `dosage` attribute me "prescription medicine" likha ho.
- Developer mode me test karein: `bin/magento deploy:mode:set developer` — LESS errors console me dikhengi.
