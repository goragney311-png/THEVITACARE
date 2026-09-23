<?php
declare(strict_types=1);

namespace TheVitaCare\Setup\Setup\Patch\Data;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\CategoryFactory;
use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\Store\Model\StoreManagerInterface;

/** Creates the 11 store categories under the root category (same as thevitacare.com). */
class CreateCategories implements DataPatchInterface
{
    private const CATEGORIES = [
        ['Supplements', 'supplements', 'Generic pharmaceutical tablets and health supplements sourced from licensed Indian manufacturers.'],
        ['Skin Care', 'skin-care', 'Hydration, anti-aging and acne care essentials.'],
        ['Serum', 'serum', 'Concentrated actives for targeted skin concerns.'],
        ['Sunscreens', 'sunscreens', 'Broad-spectrum daily sun protection.'],
        ['Eye Cream', 'eye-cream', 'Brighten and de-puff the delicate under-eye area.'],
        ['Face Wash', 'face-wash', 'Gentle daily cleansers for every skin type.'],
        ['Hair Care', 'hair-care', 'Nourishing oils and treatments for stronger hair.'],
        ['Hair Color', 'hair-color', 'Ammonia-free, long-lasting hair colour.'],
        ['Lip Care', 'lip-care', 'Balms and treatments for soft, healthy lips.'],
        ['Lipsticks', 'lipsticks', 'Rich, long-wear colour.'],
        ['Tools & Accessories', 'tools-accessories', 'Beauty tools and personal care accessories.'],
    ];

    public function __construct(
        private readonly CategoryFactory $categoryFactory,
        private readonly CategoryRepositoryInterface $categoryRepository,
        private readonly StoreManagerInterface $storeManager
    ) {}

    public function apply(): void
    {
        $rootId = (int) $this->storeManager->getStore()->getRootCategoryId();
        $root = $this->categoryRepository->get($rootId);
        $pos = 1;
        foreach (self::CATEGORIES as [$name, $urlKey, $desc]) {
            $existing = $this->categoryFactory->create()->getCollection()
                ->addAttributeToFilter('url_key', $urlKey)->addAttributeToFilter('parent_id', $rootId)->getFirstItem();
            if ($existing->getId()) { continue; }
            $cat = $this->categoryFactory->create();
            $cat->setName($name)->setUrlKey($urlKey)->setDescription($desc)
                ->setIsActive(true)->setIncludeInMenu(true)->setIsAnchor(true)
                ->setParentId($rootId)->setPath($root->getPath())->setPosition($pos++)
                ->setDisplayMode('PRODUCTS');
            $this->categoryRepository->save($cat);
        }
    }

    public static function getDependencies(): array { return []; }
    public function getAliases(): array { return []; }
}
