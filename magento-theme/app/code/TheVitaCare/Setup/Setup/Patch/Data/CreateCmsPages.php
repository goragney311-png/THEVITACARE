<?php
declare(strict_types=1);

namespace TheVitaCare\Setup\Setup\Patch\Data;

use Magento\Cms\Api\Data\PageInterfaceFactory;
use Magento\Cms\Api\PageRepositoryInterface;
use Magento\Cms\Model\ResourceModel\Page\CollectionFactory;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

/**
 * Creates / updates CMS pages: home (set as store homepage), about, shipping-returns.
 * Markup mirrors the Next.js build and is styled by web/css/source/_extend.less.
 */
class CreateCmsPages implements DataPatchInterface
{
    public function __construct(
        private readonly PageInterfaceFactory $pageFactory,
        private readonly PageRepositoryInterface $pageRepository,
        private readonly CollectionFactory $pageCollectionFactory,
        private readonly WriterInterface $configWriter
    ) {}

    public function apply(): void
    {
        $this->savePage('tvc-home', 'Home – THEVITACARE', $this->homeHtml(), '1column');
        $this->savePage('about', 'About Us', $this->aboutHtml(), '1column');
        $this->savePage('shipping-returns', 'Shipping & Returns', $this->shippingHtml(), '1column');
        $this->configWriter->save('web/default/cms_home_page', 'tvc-home');
    }

    private function savePage(string $identifier, string $title, string $content, string $layout): void
    {
        $existing = $this->pageCollectionFactory->create()->addFieldToFilter('identifier', $identifier)->getFirstItem();
        $page = $existing->getId() ? $this->pageRepository->getById((int) $existing->getId()) : $this->pageFactory->create();
        $page->setIdentifier($identifier)->setTitle($title)->setContentHeading('')->setContent($content)
            ->setPageLayout($layout)->setIsActive(true)->setStores([0]);
        $this->pageRepository->save($page);
    }

    private function homeHtml(): string
    {
        $hero = '{{view url="images/hero.jpg"}}';
        $media = '{{media url="catalog/category/"}}';
        $cats = [
            ['Supplements', 'supplements', 'tabs-white-blister.jpg'], ['Skin Care', 'skin-care', 'skincare-set.jpg'], ['Serum', 'serum', 'serum-amber.jpg'],
            ['Sunscreens', 'sunscreens', 'sunscreen-spf50.jpg'], ['Eye Cream', 'eye-cream', 'cream-jar.jpg'], ['Face Wash', 'face-wash', 'face-wash.jpg'],
            ['Hair Care', 'hair-care', 'hair-oil.jpg'], ['Hair Color', 'hair-color', 'hair-elixir.jpg'], ['Lip Care', 'lip-care', 'cream-jars.jpg'],
            ['Lipsticks', 'lipsticks', 'lipsticks.jpg'], ['Tools & Accessories', 'tools-accessories', 'makeup-tools.jpg'],
        ];
        $catHtml = '';
        foreach ($cats as [$n, $k, $img]) {
            $catHtml .= "<a href=\"{{store url='{$k}.html'}}\"><img src=\"{$media}{$img}\" alt=\"{$n}\"/><b>{$n}</b></a>";
        }
        $faqs = [
            ['What products does TheVitaCare offer?', 'TheVitaCare offers high-quality skincare products focused on hydration, anti-aging and acne care, along with supplements, hair care, lip care and beauty accessories.'],
            ['How do I place an order?', 'Select your product, click “Add to Cart,” and proceed to our secure checkout. You will receive an order number to track your shipment.'],
            ['How long does delivery take?', 'Orders are processed within 1–2 business days. Delivery usually takes 16–20 business days depending on location and courier conditions.'],
            ['Are your products authentic?', 'We work with established suppliers, distributors and fulfillment partners based in India who operate in compliance with applicable laws. Products are sourced through legitimate wholesale channels.'],
            ['Do I need a prescription?', 'Some items in our Supplements category are prescription medicines. Please consult a licensed healthcare professional before use; we may request a valid prescription before dispatch.'],
        ];
        $faqHtml = '';
        foreach ($faqs as [$q, $a]) { $faqHtml .= "<details><summary>{$q}</summary><p>{$a}</p></details>"; }

        return <<<HTML
<section class="tvc-hero"><div class="tvc-hero-inner">
  <div class="tvc-hero-text">
    <span class="tvc-pill">🇺🇸 Shipping across the United States</span>
    <h1>Your Online Destination for <em>Healthcare</em> &amp; Skincare</h1>
    <p>A curated selection of supplements, skincare, serums, sunscreens and personal care essentials – sourced from verified suppliers and delivered to your door.</p>
    <a class="tvc-btn" href="{{store url='supplements.html'}}">Shop Now</a>
    <a class="tvc-btn outline" href="{{store url='about'}}">Our Story</a>
    <div class="tvc-stats"><div><strong>30+</strong><span>Products</span></div><div><strong>11</strong><span>Categories</span></div><div><strong>4.7★</strong><span>Average Rating</span></div></div>
  </div>
  <div class="tvc-hero-img"><img src="{$hero}" alt="THEVITACARE products"/></div>
</div></section>

<div class="tvc-features">
  <div class="tvc-feature"><span class="ico">🔒</span><div><b>Secure Payment</b><small>End-to-end encryption. Credit/debit cards and PayPal accepted.</small></div></div>
  <div class="tvc-feature"><span class="ico">✅</span><div><b>Verified Suppliers</b><small>Products sourced through recognised distribution networks.</small></div></div>
  <div class="tvc-feature"><span class="ico">📦</span><div><b>Fast Processing</b><small>Orders processed within 1–2 business days.</small></div></div>
  <div class="tvc-feature"><span class="ico">🚚</span><div><b>Tracked Shipping</b><small>Delivery in 16–20 business days. Free shipping over \$150.</small></div></div>
</div>

<section class="tvc-section">
  <div class="tvc-section-head"><div class="eyebrow">Best Selling Products</div><h2>Weekly Featured Products</h2></div>
  {{widget type="Magento\\CatalogWidget\\Block\\Product\\ProductsList" show_pager="0" products_count="8" template="Magento_CatalogWidget::product/widget/content/grid.phtml" conditions_encoded="^[`1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,`aggregator`:`all`,`value`:`1`,`new_child`:``^],`1--1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,`attribute`:`sku`,`operator`:`()`,`value`:`IVERA6MG, IVERA12MG, IVERA20MG, IVERA24MG, IVERJOHN12MG, FENBEN500, RIFAX550H, XIFAX550`^]^]"}}
</section>

<section class="tvc-section"><div class="tvc-about">
  <div><div class="eyebrow">About THEVITACARE</div><h2>Curated healthcare &amp; skincare, delivered</h2>
    <p>THEVITACARE is an online destination for healthcare and skincare products, offering a curated selection of brands to customers across the United States. We source products through third-party distributors, suppliers and fulfillment partners to provide a range of skincare, wellness and personal care products.</p>
    <p><small>THEVITACARE operates as an independent online retailer and marketplace and does not manufacture or develop products. All items available on our website are sourced from third-party brands and suppliers.</small></p>
    <a class="tvc-btn" href="{{store url='about'}}">Read Our Story</a></div>
  <div class="tvc-about-stats"><div><strong>1–2</strong>Days processing</div><div><strong>16–20</strong>Days delivery</div><div><strong>\$150+</strong>Free shipping</div><div><strong>24h</strong>Support response</div></div>
</div></section>

<section class="tvc-section">
  <div class="tvc-section-head"><div class="eyebrow">Browse our categories</div><h2>Shop by Category</h2></div>
  <div class="tvc-cats">{$catHtml}</div>
</section>

<section class="tvc-trending"><div class="tvc-section-head"><div class="eyebrow">Trending This Week</div><h2>Top Trending Collections</h2>
  <p>Discover this week's top trending collections that everyone is raving about! From must-have skincare essentials to the latest in nutrition, explore what's making waves in the beauty and wellness world.</p></div>
  {{widget type="Magento\\CatalogWidget\\Block\\Product\\ProductsList" show_pager="0" products_count="8" template="Magento_CatalogWidget::product/widget/content/grid.phtml" conditions_encoded="^[`1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Combine`,`aggregator`:`all`,`value`:`1`,`new_child`:``^],`1--1`:^[`type`:`Magento||CatalogWidget||Model||Rule||Condition||Product`,`attribute`:`sku`,`operator`:`()`,`value`:`RIFAX550H, XIFAX550, FENBEN500, RIFAX400, SRVC30, SSSPF50, SKHA50, LSRED01`^]^]"}}
</section>

<section class="tvc-section">
  <div class="tvc-section-head"><div class="eyebrow">Help</div><h2>Frequently Asked Questions</h2></div>
  <div class="tvc-faq">{$faqHtml}</div>
</section>

<section class="tvc-newsletter"><h2>Stay in the loop</h2><p>Get wellness tips and exclusive offers straight to your inbox.</p>{{block class="Magento\\Newsletter\\Block\\Subscribe" name="tvc.newsletter" template="Magento_Newsletter::subscribe.phtml"}}</section>
HTML;
    }

    private function aboutHtml(): string
    {
        return <<<HTML
<h1>About Us</h1>
<p><strong>Welcome to THEVITACARE</strong> – an online store focused on beauty, skincare, and personal care products, serving customers across the United States. Founded in 2024, our goal is to provide a simple, reliable, and convenient online shopping experience for everyday essentials.</p>
<h2>Our Story</h2>
<p>THEVITACARE was created to make online shopping for skincare and personal care products easier and more accessible. We understand that customers value convenience, clear product information, and dependable service. Our platform is designed to bring together a curated selection of products in one place, allowing customers to browse and shop easily from the comfort of their homes.</p>
<h2>Supplier &amp; Product Authenticity</h2>
<p>At THEVITACARE, we are committed to sourcing products responsibly and ensuring product authenticity. We work with established suppliers, distributors, and fulfillment partners based in India who operate in compliance with applicable local laws and industry standards. Products are sourced through legitimate wholesale and distribution channels and are handled according to standard storage and shipping practices.</p>
<p><strong>What We Mean by “Verified Suppliers”:</strong></p>
<ul><li>Suppliers are evaluated based on their business registration and operational history</li><li>Products are sourced through recognized distribution networks</li><li>We aim to maintain consistency in product quality and fulfillment reliability</li></ul>
<p><strong>Important Clarification:</strong> THEVITACARE is an independent online retailer and is not the manufacturer of the products listed on our website. We do not claim direct affiliation with all brands featured unless explicitly stated. Due to supplier agreements and operational reasons, we do not publicly list individual supplier identities. However, we take reasonable steps to ensure that products supplied meet expected quality and authenticity standards.</p>
<p>If you have questions about a specific product, feel free to contact our support team at <a href="mailto:order@thevitacare.com">order@thevitacare.com</a> before purchasing.</p>
<h2>What We Offer</h2>
<ul><li>Skincare products</li><li>Lip care and sunscreens</li><li>Beauty accessories</li><li>Personal care essentials</li><li>Hair care &amp; colour</li><li>Health supplements</li></ul>
<h2>Customer Commitment</h2>
<ul><li>Providing a convenient and secure online shopping platform</li><li>Offering carefully selected products</li><li>Maintaining transparent policies</li><li>Delivering responsive and helpful customer support</li></ul>
<div class="tvc-why"><h3>Company details</h3><ul>
<li><b>Website Name:</b> TheVitaCare.com</li><li><b>Company Name:</b> THEVITACARE</li><li><b>Registration Number:</b> UDYAM-GJ-22-0600303</li>
<li><b>Address:</b> 577 Gadhpur Township, Pasodara Kathodara, Surat, Gujarat, 394326, India</li><li><b>Email:</b> order@thevitacare.com</li><li><b>Phone:</b> +91 7069698484</li></ul></div>
HTML;
    }

    private function shippingHtml(): string
    {
        return <<<HTML
<h1>Shipping &amp; Returns</h1>
<h2>🚚 Shipping</h2>
<p>Orders are processed within 1–2 business days. Delivery usually takes 16–20 business days depending on location and courier conditions. Free shipping on orders over \$150; \$15 flat rate otherwise. All orders are shipped with tracking in discreet packaging.</p>
<h2>↩️ Returns &amp; Refunds</h2>
<p>If your order arrives damaged or incorrect, contact us within 7 days of delivery with photos and your order number at <a href="mailto:order@thevitacare.com">order@thevitacare.com</a>. We will arrange a replacement or refund.</p>
<h2>🔒 Privacy</h2>
<p>We respect your privacy. Your personal information is used only to process and deliver your order and is never sold to third parties.</p>
HTML;
    }

    public static function getDependencies(): array { return [CreateCategories::class]; }
    public function getAliases(): array { return []; }
}
